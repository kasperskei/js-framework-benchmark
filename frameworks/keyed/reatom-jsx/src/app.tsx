/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain, unicorn/no-useless-undefined */
import {
  action,
  atom,
  reatomLinkedList,
  random,
  type AtomMut,
  type LLNode,
  LL_NEXT,
  LL_PREV,
  type LinkedList,
} from '@reatom/framework'
import {
  type JSX,
} from '@reatom/jsx'

interface Item {
  id: number
  isSelectedAtom: AtomMut<boolean>
  labelAtom: AtomMut<string>
}
type ListItem = LLNode<Item>

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

let nextId = 1
const rand = (max: number): number => random(0, max - 1)
const buildData = (length: number) => Array.from({ length }, () => ({
  id: nextId++,
  isSelectedAtom: atom(false),
  labelAtom: atom(adjectives[rand(adjectives.length)] + ' ' + colors[rand(colors.length)] + ' ' + nouns[rand(nouns.length)]),
}))

const listAtom = reatomLinkedList({
  create: (ctx, item: Item) => item,
  key: 'id',
})
const selectedAtom = atom<ListItem | undefined>(undefined)

const createOneThousandRows = action((ctx) => listAtom.batch(ctx, () => {
  deleteAllRows(ctx)
  buildData(1_000).forEach((item) => listAtom.create(ctx, item))
}))
const createTenThousandRows = action((ctx) => listAtom.batch(ctx, () => {
  deleteAllRows(ctx)
  buildData(10_000).forEach((item) => listAtom.create(ctx, item))
}))
const appendOneThousandRows = action((ctx) => listAtom.batch(ctx, () => {
  buildData(1_000).forEach((item) => listAtom.create(ctx, item))
}))
const updateEveryTenthRowLabel = action((ctx) => {
  const list = ctx.get(listAtom)
  const size = list.size
  for (let i = 0; i < size; i += 10) {
    at(list, i)!.labelAtom(ctx, (state) => state + ' !!!')
  }
})
const deleteSingleRow = action((ctx, item: ListItem) => listAtom.remove(ctx, item))
const deleteAllRows = action((ctx) => {
  listAtom.clear(ctx)
  selectRow(ctx, undefined)
})
const swapTwoRows = action((ctx) => {
  const list = ctx.get(listAtom)
  if (list.size > 998) {
    listAtom.swap(ctx, at(list, 1)!, at(list, 998)!)
  }
})
const selectRow = action((ctx, item: ListItem | undefined) => {
  ctx.get(selectedAtom)?.isSelectedAtom(ctx, false)
  item?.isSelectedAtom(ctx, true)
  selectedAtom(ctx, item)
})

const at = <
  List extends LinkedList<LLNode<object>>,
  LLItem = List extends LinkedList<infer Item> ? Item : null,
>(list: List, index: number): LLItem | null => {
  if (index < 0) index += list.size
  if (index < 0 || index >= list.size) return null

  if (index < list.size / 2) {
    let item = list.head!
    while (index-- > 0) item = item[LL_NEXT]!
    return item as LLItem
  } else {
    index = list.size - index - 1
    let item = list.tail!
    while (index-- > 0) item = item[LL_PREV]!
    return item as LLItem
  }
}

export const App = () => {
  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>@reatom/jsx keyed</h1>
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
        <tbody>
          {listAtom.reatomMap((ctx, item) => (
            <TableRow item={item}></TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Button = (props: {
  id: string
  label: string
  'on:click': JSX.EventHandler<HTMLButtonElement, MouseEvent>
}) => (
  <div class="col-sm-6 smallpad">
    <button
      id={props.id}
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
  item: ListItem
}) => (
  <tr
    class={atom((ctx) => ctx.spy(item.isSelectedAtom) ? 'danger' : undefined)}
    data-label={item.labelAtom}
  >
    <td class="col-md-1">{item.id}</td>
    <td class="col-md-4">
      <a on:click={(ctx) => selectRow(ctx, item)}>{item.labelAtom}</a>
    </td>
    <td class="col-md-1">
      <a on:click={(ctx) => deleteSingleRow(ctx, item)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
)
