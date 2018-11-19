<template>
  <div style="height:100%">
      <router-view></router-view>
  </div>
</template>
<script>
export default {
  
}
</script>
<style>
.ivu-input{
    height: inherit !important;
}
html,body,{
 width: 100%; 
 height: 100%; 
 margin: 0; 
 padding: 0; 
 overflow: hidden;
}
.custom-ol-scaleline {
      /*background: #95b9e6;*/
  background: rgba(0,60,136,.3);
  border-radius: 4px;
  bottom: 25px;
  right: 25px;
  padding: 2px;
  position: fixed;
}
.custom-ol-scaleline-inner {
    border: 1px solid #eee;
    border-top: none;
    color: #eee;
    font-size: 10px;
    text-align: center;
    margin: 1px;
    will-change: contents,width;
}
.custom-ol-rotate {
  position: relative;
  top:-5px;
}
.text-danger {
  color: #f05050;
}
/*d2 工具条*/
.d2-draw-helper{
  display: inline-block;
  margin: 10px;
  padding: 5px;
  background: white;
  border:none;
  position:relative;
  width: 420px;
  box-shadow: 5px 5px 5px #ccc;

}
.d2-draw-helper  li{
  display: inline-block;
  background-color:#F0F3F4;
  list-style: none;
  padding:10px;
  height:35px;
  color:#000;
  border:solid 1px #16AAD8;
}
.row{
    float: left;
}
.rotatetarget{
  position: relative;
  top:5px;
}
.MousePosition {
    width: 170px;
    text-align: center;
}
</style>


