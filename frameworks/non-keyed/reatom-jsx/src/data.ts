import {
  atom,
  type AtomMut,
} from '@reatom/framework'

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

const random = (max: number): number => Math.round(Math.random() * 1000) % max

let nextId = 1

export interface Item {
  id: number
  label: AtomMut<string>
}

export const buildData = (length: number) => {
  return Array.from({ length }, (_, index) => ({
    id: nextId++,
    label: atom(`${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`),
  }))
}