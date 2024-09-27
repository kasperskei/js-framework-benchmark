import {
  atom,
  action,
  type Action,
} from '@reatom/framework'
import {
  buildData,
  type Item,
} from './data.ts'

const dataAtom = atom([] as Item[])
const selectedAtom = atom(undefined as Item['id'] | undefined)

const run = action((ctx) => dataAtom(ctx, buildData(1_000)))
const runLots = action((ctx) => dataAtom(ctx, buildData(10_000)))
const add = action((ctx) => dataAtom(ctx, (state) => [...state, ...buildData(1_000)]))
const update = action((ctx) => {
  const data = ctx.get(dataAtom)
  const length = data.length
  for (let i = 0; i < length; i += 10) {
    data[i].label(ctx, (state) => state + ' !!!')
  }
})
const remove = action((ctx, id) => dataAtom(ctx, (state) => state.filter((item) => item.id !== id)))
const clear = action((ctx) => dataAtom(ctx, []))
const swapRows = action((ctx) => {
  const data = ctx.get(dataAtom)
  if (data.length > 998) {
    const left = data[1]
    const right = data[998]
    const swapped = data.slice()
    swapped[1] = right
    swapped[998] = left
    dataAtom(ctx, swapped)
  }
})
const select = action((ctx, id: Item['id']) => selectedAtom(ctx, id))

export const App = () => {
  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>@reatom/jsx</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button
                id="run"
                label="Create 1,000 rows"
                onClick={run}
              ></Button>
              <Button
                id="runlots"
                label="Create 10,000 rows"
                onClick={runLots}
              ></Button>
              <Button
                id="add"
                label="Append 1,000 rows"
                onClick={add}
              ></Button>
              <Button
                id="update"
                label="Update every 10th row"
                onClick={update}
              ></Button>
              <Button
                id="clear"
                label="Clear"
                onClick={clear}
              ></Button>
              <Button
                id="swaprows"
                label="Swap Rows"
                onClick={swapRows}
              ></Button>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {atom((ctx) => ctx.spy(dataAtom).map((item) => (
            <tr
              class={atom((ctx) => item.id === ctx.spy(selectedAtom) ? 'danger' : undefined)}
              data-label={item.label}
            >
              <td class="col-md-1">{item.id}</td>
              <td class="col-md-4">
                <a on:click={(ctx) => select(ctx, item.id)}>{item.label}</a>
              </td>
              <td class="col-md-1">
                <a on:click={(ctx) => remove(ctx, item.id)}>
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </a>
              </td>
              <td class="col-md-6"></td>
            </tr>
          )))}
        </tbody>
      </table>

      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  )
}

const Button = (props: {
  id: string
  label: string
  onClick: Action
}) => (
  <div class="col-sm-6 smallpad">
    <button
      prop:id={props.id}
      class="btn btn-primary btn-block"
      type="button"
      on:click={props.onClick}
    >
      {props.label}
    </button>
  </div>
)
