"use strict";

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const rowTemplate = document.createElement("tr");
rowTemplate.innerHTML =
  "<td class='col-md-1'> </td><td class='col-md-4'><a> </a></td><td class='col-md-1'><a><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td><td class='col-md-6'></td>";

var rowId = 1;
function buildData(count = 1000) {
  var adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ];
  var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
  var nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];
  var data = [];
  for (var i = 0; i < count; i++)
    data.push({
      id: rowId++,
      label:
        adjectives[_random(adjectives.length)] +
        " " +
        colours[_random(colours.length)] +
        " " +
        nouns[_random(nouns.length)],
    });
  return data;
}

var getParentId = function (elem) {
  while (elem) {
    if (elem.tagName === "TR") {
      return elem.data_id;
    }
    elem = elem.parentNode;
  }
  return undefined;
};
class Main {
  constructor() {
    this.data = [];
    this.selectedRow = undefined;

    document.getElementById("main").addEventListener("click", (e) => {
      //console.log("listener",e);
      if (e.target.matches("#add")) {
        e.stopPropagation();
        //console.log("add");
        this.add();
      } else if (e.target.matches("#run")) {
        e.stopPropagation();
        //console.log("run");
        this.run();
      } else if (e.target.matches("#update")) {
        e.stopPropagation();
        //console.log("update");
        this.update();
      } else if (e.target.matches("#runlots")) {
        e.stopPropagation();
        //console.log("runLots");
        this.runLots();
      } else if (e.target.matches("#clear")) {
        e.stopPropagation();
        //console.log("clear");
        this.clear();
      } else if (e.target.matches("#swaprows")) {
        e.stopPropagation();
        //console.log("swapRows");
        this.swapRows();
      }
    });
    document.getElementById("tbody").addEventListener("click", (e) => {
      e.stopPropagation();
      let p = e.target;
      while (p && p.tagName !== "TD") {
        p = p.parentNode;
      }
      if (!p) return;
      if (p.parentNode.childNodes[1] == p) {
        console.log("click on label");
        let id = getParentId(e.target);
        let idx = this.data.findIndex((row) => row.id === id);
        this.select(idx);
      } else if (p.parentNode.childNodes[2] == p) {
        console.log("click on remove");
        let id = getParentId(e.target);
        let idx = this.data.findIndex((row) => row.id === id);
        this.delete(idx);
      }
    });
    this.tbody = document.getElementById("tbody");
    this.table = document.getElementsByTagName("table")[0];
  }
  run() {
    this.removeAllRows();
    this.data = [];
    this.appendRows(buildData(1000));
    this.unselect();
  }
  add() {
    this.appendRows(buildData(1000));
  }
  update() {
    for (let i = 0; i < this.data.length; i += 10) {
      this.data[i].label += " !!!";
      this.tbody.childNodes[i].firstChild.nextSibling.firstChild.firstChild.nodeValue = this.data[i].label;
    }
  }
  unselect() {
    if (this.selectedRow !== undefined) {
      this.selectedRow.className = "";
      this.selectedRow = undefined;
    }
  }
  select(idx) {
    this.unselect();
    this.selectedRow = this.tbody.childNodes[idx];
    this.selectedRow.className = "danger";
  }
  delete(idx) {
    // Remove that row from the DOM
    this.tbody.childNodes[idx].remove();
    this.data.splice(idx, 1);
  }
  removeAllRows() {
    // ~258 msecs
    // for(let i=this.rows.length-1;i>=0;i--) {
    //     tbody.removeChild(this.rows[i]);
    // }
    // ~251 msecs
    // for(let i=0;i<this.rows.length;i++) {
    //     tbody.removeChild(this.rows[i]);
    // }
    // ~216 msecs
    // var cNode = tbody.cloneNode(false);
    // tbody.parentNode.replaceChild(cNode ,tbody);
    // ~212 msecs
    this.tbody.textContent = "";

    // ~236 msecs
    // var rangeObj = new Range();
    // rangeObj.selectNodeContents(tbody);
    // rangeObj.deleteContents();
    // ~260 msecs
    // var last;
    // while (last = tbody.lastChild) tbody.removeChild(last);

    // const clone = this.tbody.cloneNode();
    // this.tbody.remove();
    // this.table.insertBefore((this.tbody = clone), null);
  }
  runLots() {
    this.removeAllRows();
    this.data = [];
    this.appendRows(buildData(10000));
    this.unselect();
  }
  clear() {
    this.data = [];
    // This is actually a bit faster, but close to cheating
    // requestAnimationFrame(() => {
    this.removeAllRows();
    this.unselect();
    // });
  }
  swapRows() {
    if (this.data.length > 998) {
      let tmp = this.data[998];
      this.data[998] = this.data[1];
      this.data[1] = tmp;

      let a = this.tbody.lastChild.previousSibling,
        b = a.nextSibling,
        c = this.tbody.firstChild.nextSibling;
      this.tbody.insertBefore(this.tbody.replaceChild(a, c), b);
    }

    // let old_selection = this.store.selected;
    // this.store.swapRows();
    // this.updateRows();
    // this.unselect();
    // if (old_selection>=0) {
    //     let idx = this.store.data.findIndex(d => d.id === old_selection);
    //     if (idx > 0) {
    //         this.store.select(this.data[idx].id);
    //         this.selectedRow = this.rows[idx];
    //         this.selectedRow.className = "danger";
    //     }
    // }
  }
  appendRows(newData) {
    // Using a document fragment is slower...
    // var docfrag = document.createDocumentFragment();
    // for(let i=this.rows.length;i<this.store.data.length; i++) {
    //     let tr = this.createRow(this.store.data[i]);
    //     this.rows[i] = tr;
    //     this.data[i] = this.store.data[i];
    //     docfrag.appendChild(tr);
    // }
    // this.tbody.appendChild(docfrag);

    // ... than adding directly
    var tbody = this.tbody;
    for (let i = 0, len = newData.length; i < len; i++) {
      tbody.appendChild(this.createRow(newData[i]));
      this.data.push(newData[i]);
    }
  }
  createRow(data) {
    const tr = rowTemplate.cloneNode(true),
      td1 = tr.firstChild,
      a2 = td1.nextSibling.firstChild;
    tr.data_id = data.id;
    td1.firstChild.nodeValue = data.id;
    a2.firstChild.nodeValue = data.label;
    return tr;
  }
}

new Main();
