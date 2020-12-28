//Create variables here
var dog,dogImg,dogImg1,database,foodStock,x;
var foodS,fedTime,lastFed,feed,addFood,foodObj,garden,bedroom,washroom,readState;
var gameState
function preload()
{
  //load images here
  dogImg=loadImage("images/dogImg.png");
  dogImg1=loadImage("images/dogImg1.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000, 800);
  foodObj=new Food();
  dog=createSprite(400,350,50,50);
  dog.addImage(dogImg);
  dog.scale=0.3;
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  readState=database.ref("gameState");
  readState.on("value",function(data){
    gameState=data.val();
  })
}


function draw() {  
  background("lightgreen");
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill(255,255,254);
  textSize(14);
 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("playing");
   foodObj.garden();
 }else if(currentTime==(lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
 }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
 }else{
   update("Hungry");
   foodObj.display();
 }
 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   dog.addImage(dogImg);
 }
  drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}
function feedDog(){
  dog.addImage(dogImg1);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function update(state){
  database.ref("/").update({
    gameState:state
  })
}
function addFoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}


