import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        max-width: 500px;
        min-height: 500px;
      }
      .container {
        display: flex;
        flex-direction: column;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        gap: 1px;
        padding: 16px;
      }
      .box {
        background: red;
        height: 25px;
      }
      .snake {
        background: blue;
      }
      
      .snake:last-child {
        border-radius: 20px;
      }
      
      .arrows {
        display: flex;
        justify-content: center;
        padding: 32px 0;
        gap: 32px;
        color: white;
        font-weight: bold;
        font-size: 20px;
      }
      
      .arrow {
        display: flex;
        align-self: baseline;
        border-radius: 50%;
        background: green;
        width: 30px;
        height: 30px;
        justify-content: center;
        align-items: center;
      }
    `;
  }

  render() {
    return html`
      <div class='container'>
        <div class='grid'>
          ${this.gridArray.map((item) => html`
            <div class='box ${this.snakeArray.indexOf(item) !== -1 ? 'snake':''}'></div>
          `)}
        </div>
        <div class='arrows'>
          <div class='arrow' @click='${this.moveLeft}'> < </div>
          <div class='arrow' @click='${this.moveRight}'> > </div>
          <div class='arrow' @click='${this.moveTop}'> ^ </div>
          <div class='arrow' @click='${this.moveBottom}' style="transform: rotate(180deg)"> ^ </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      gridArray: {type: Array},
      snakeArray: {type: Array},
    };
  }

  static rowLength = 20;
  static snakeLength = 5;
  static startPositionColumn = 0;

  constructor() {
    super();
    this.lastMove = 'right'
    this.gridArray = [];
    this.fillGrid();
    this.snakeArray = [];
    this.fillSnake();
    this.headCoordinates = {row: MyElement.snakeLength - 1, column: 0};
    //eventListener
    //math.random
  }

  fillSnake() {
    for (let i = 0; i < MyElement.snakeLength; i++) {
      this.snakeArray.push( i +":"+ 0);
    }
  }

  fillGrid() {
    for (let i = 0; i < MyElement.rowLength; i++) {
      this.fillRow(i);
    }
  }

  fillRow(column) {
    for (let i = 0; i < MyElement.rowLength; i++) {
      this.gridArray.push( i +':'+ column);
    }
  }

  moveRight() {
    if(this.lastMove !== 'left') {
      this.move(1, 0)
      setTimeout(() => {
        if (this.lastMove === 'right') this.moveRight()
      }, 1000)
    }
  }

  moveLeft() {
    if(this.lastMove !== 'right') {
      this.lastMove = 'left'
      this.move(-1, 0)
      setTimeout(() => {
        if (this.lastMove === 'left') this.moveLeft()
      }, 1000)
    }
  }
  moveTop() {
    if(this.lastMove !== 'bottom'){
      this.lastMove = 'top';
      this.move(0, -1)

      setTimeout(() => {
        if (this.lastMove === 'top') this.moveTop()
      }, 1000)
      }
  }

  moveBottom() {
    if(this.lastMove !== 'top') {
      this.lastMove = 'bottom'
      this.move(0, 1)
      setTimeout(() => {
        if (this.lastMove === 'bottom') this.moveBottom()
      }, 1000)
    }
  }

  move(additionalRow, additionalColumn) {
    this.headCoordinates.row += additionalRow
    this.headCoordinates.column += additionalColumn
    this.checkBorders();
    if(!this.lastMove) return;
    this.snakeArray.splice(0,1);
    this.snakeArray.push(this.headCoordinates.row +':'+ this.headCoordinates.column)
    this.snakeArray = [...this.snakeArray];

  }

  checkBorders() {
    if(
      this.headCoordinates.row >= MyElement.rowLength ||
      this.headCoordinates.column >= MyElement.rowLength ||
      this.headCoordinates.row < 0 ||
      this.headCoordinates.column < 0
    ){
      this.lastMove = '';
    }
  }

  eatApple(){
    
  }

}

window.customElements.define('my-element', MyElement);