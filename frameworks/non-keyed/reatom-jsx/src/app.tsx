/* eslint-disable unicorn/no-useless-undefined */
import {
  action,
  atom,
  random,
  type Action,
  type AtomMut,
} from '@reatom/framework'

interface Item {
  id: number
  label: AtomMut<string>
}

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

let nextId = 1
const rand = (max: number): number => random(0, max - 1)
const buildData = (length: number) => Array.from({ length }, () => ({
  id: nextId++,
  label: atom(adjectives[rand(adjectives.length)] + ' ' + colors[rand(colors.length)] + ' ' + nouns[rand(nouns.length)]),
}))

const arrayAtom = atom<Item[]>([])
const selectedIdAtom = atom<Item['id'] | undefined>(undefined)

const createOneThousandRows = action((ctx) => {
  arrayAtom(ctx, buildData(1_000))
  selectedIdAtom(ctx, undefined)
})
const createTenThousandRows = action((ctx) => {
  arrayAtom(ctx, buildData(10_000))
  selectedIdAtom(ctx, undefined)
})
const appendOneThousandRows = action((ctx) => arrayAtom(ctx, (state) => [...state, ...buildData(1_000)]))
const updateEveryTenthRowLabel = action((ctx) => {
  const data = ctx.get(arrayAtom)
  const length = data.length
  for (let i = 0; i < length; i += 10) {
    data[i].label(ctx, (state) => state + ' !!!')
  }
})
const deleteSingleRow = action((ctx, id) => arrayAtom(ctx, (state) => state.filter((item) => item.id !== id)))
const deleteAllRows = action((ctx) => {
  arrayAtom(ctx, [])
  selectedIdAtom(ctx, undefined)
})
const swapTwoRows = action((ctx) => {
  const data = ctx.get(arrayAtom)
  if (data.length > 998) {
    const left = data[1]
    const right = data[998]
    const swapped = data.slice()
    swapped[1] = right
    swapped[998] = left
    arrayAtom(ctx, swapped)
  }
})
const selectRow = action((ctx, id: Item['id']) => selectedIdAtom(ctx, id))

export const App = () => {
  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>@reatom/jsx non-keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button
                id="run"
                label="Create 1,000 rows"
                on:click={createOneThousandRows}
              ></Button>
              <Button
                id="runlots"
                label="Create 10,000 rows"
                on:click={createTenThousandRows}
              ></Button>
              <Button
                id="add"
                label="Append 1,000 rows"
                on:click={appendOneThousandRows}
              ></Button>
              <Button
                id="update"
                label="Update every 10th row"
                on:click={updateEveryTenthRowLabel}
              ></Button>
              <Button
                id="clear"
                label="Clear"
                on:click={deleteAllRows}
              ></Button>
              <Button
                id="swaprows"
                label="Swap Rows"
                on:click={swapTwoRows}
              ></Button>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        {atom((ctx) => (
          <tbody>
            {ctx.spy(arrayAtom).map((item) => (
              <TableRow item={item}></TableRow>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

const Button = (props: {
  id: string
  label: string
  'on:click': Action
}) => (
  <div class="col-sm-6 smallpad">
    <button
      prop:id={props.id}
      class="btn btn-primary btn-block"
      type="button"
      on:click={props['on:click']}
    >
      {props.label}
    </button>
  </div>
)

const TableRow = ({
  item,
}: {
  item: Item
}) => (
  <tr
    /** @todo Заменить на select? */
    class={atom((ctx) => item.id === ctx.spy(selectedIdAtom) ? 'danger' : undefined)}
    data-label={item.label}
  >
    <td class="col-md-1">{item.id}</td>
    <td class="col-md-4">
      <a on:click={(ctx) => selectRow(ctx, item.id)}>{item.label}</a>
    </td>
    <td class="col-md-1">
      <a on:click={(ctx) => deleteSingleRow(ctx, item.id)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
)