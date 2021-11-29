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

      .apple {
        background:green;
      }
    `;
  }

  render() {
    return html`
      <div class='container'>
        <div class='grid'>
          ${this.gridArray.map((item) => html`
            <div class='box ${this.snakeArray.indexOf(item) !== -1 ? 'snake':''} ${item === this.appleCoordinates ? 'apple' : ''}'></div>
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
      appleCoordinates: {type: String}
    };
  }

  static rowLength = 20;
  //static snakeLength = 5;
  static startPositionColumn = 0;

  constructor() {
    super();
    //this.addEventListener('click',e=>this.arrowMove(e))
    this.snakeLength = 5;
    this.lastMove = 'right';
    this.gridArray = [];
    this.fillGrid();
    this.snakeArray = [];
    this.fillSnake();
    this.headCoordinates = {row: this.snakeLength - 1, column: 0};
    this.appleCount = 0;
    this.appleCoordinates = '';
    this.generateApple();
    this.arrowMove();
    //eventListener
    //math.random
  }

  arrowMove(){
    document.addEventListener('keydown',e=>this.switchKey(e));
  }

  switchKey(event) {
    switch (event.key) {
      case "ArrowLeft":
          this.moveLeft();
          break;
      case "ArrowRight":
          this.moveRight();
          break;
      case "ArrowUp":
          this.moveTop();
          break;
      case "ArrowDown":
          this.moveBottom();
          break;
      default: 
        break;
  }
  }

  fillSnake() {
    for (let i = 0; i < this.snakeLength; i++) {
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
      this.lastMove = 'right';
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
    this.headCoordinates.row += additionalRow;
    this.headCoordinates.column += additionalColumn;
    this.checkBorders();
    this.checkSelf();
    if(!this.lastMove) return;
    this.snakeArray.splice(0,1);
    this.snakeArray.push(this.headCoordinates.row +':'+ this.headCoordinates.column);
    this.snakeArray = [...this.snakeArray];
    this.checkApple();
  }

  checkBorders() {
    if(
      this.headCoordinates.row >= MyElement.rowLength ||
      this.headCoordinates.column >= MyElement.rowLength ||
      this.headCoordinates.row < 0 ||
      this.headCoordinates.column < 0
    ){
      this.gameOver();
    }
  }

  checkSelf(){
     let head = `${this.headCoordinates.row}:${this.headCoordinates.column}`;
     let copySnake = this.snakeArray.slice(0,-1);
     if(copySnake.indexOf(head)!==-1) this.gameOver();
  }

  checkApple(){
    // აქ მარტო snakeHead-ზე შემოწმება შეიძლება
    if(this.snakeArray.indexOf(this.appleCoordinates) !== -1) {
      this.eatApple();
    }
  }

  generateApple(){
    while(true){
      let appleX = this.getRandomInt(MyElement.rowLength);
      let appleY = this.getRandomInt(MyElement.rowLength);
      let apple = `${appleX}:${appleY}`;
      //console.log(apple)
      if(this.snakeArray.indexOf(apple) === -1){
        this.appleCoordinates = apple;     
        break;
      }
    }
  }

  eatApple(){
    this.appleCount+=1;
    this.checkAppleCount();
    this.generateApple();
    
  }

  checkAppleCount(){
    if(this.appleCount===2){
      this.snakeArray.push(this.appleCoordinates);
      this.snakeArray = [...this.snakeArray];
      this.appleCount = 0;
    }
  }

  gameOver(){
    this.lastMove = '';
    alert('Game Over');
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

}

window.customElements.define('my-element', MyElement);