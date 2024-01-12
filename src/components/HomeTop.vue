<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "HomeTop",
  data(){
    return{
      i:1,
    }
  },
}
</script>

<template>
  <div>
    <div class="banner">
      <h2 id="text" class="wow fadeInDown">XTYOpen</h2>
      <div class="clouds">
        <img src="../assets/img/cloud1.png" style="--i:1;">
        <img src="../assets/img/cloud2.png" style="--i:2;">
        <img src="../assets/img/cloud3.png" style="--i:3;">
        <img src="../assets/img/cloud4.png" style="--i:4;">
        <img src="../assets/img/cloud5.png" style="--i:5;">
        <img src="../assets/img/cloud1.png" style="--i:10;">
        <img src="../assets/img/cloud2.png" style="--i:9;">
        <img src="../assets/img/cloud3.png" style="--i:8;">
        <img src="../assets/img/cloud4.png" style="--i:7;">
        <img src="../assets/img/cloud5.png" style="--i:6;">
      </div>
    </div>
    <section>
      <h2 class="wow fadeInRightBig" >XTY-Open source learning website</h2>
      <p class="wow bounceInLeft">
        This website is created by VUE+Springboot. Due to limited technology, there are many areas for improvement. If you have any good suggestions, you can add my WeChat account: x1522345857 for discussion and learning. Thank you for the correction and guidance. I hope every full stack has learned something, thank you.
      </p>
    </section>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

@media (min-width: 992px){
  .banner
  {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url("../assets/img/cloud00.jpg");
    background-size: cover ;
    background-position: bottom;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .banner #text
  {
    position: relative;
    font-size: 10em;
    color:#fff;
  }
  .banner .clouds
  {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow:hidden;
    pointer-events: none;

  }
  .banner .clouds img
  {
    position: absolute;
    bottom: 0;
    max-width: 100%;
    animation: animate calc(3s * var(--i)) linear infinite;
  }

  section
  {
    position: relative;
    padding: 75px 110px;
    font-size: 1em;
  }

  section h2{
    position: relative;
    font-size: 2.5em;
    margin-bottom:20px;

  }
}


@media (min-width: 0px) and (max-width:768px) {
  .banner {
    position: relative;
    width: 100%;
    height: 65vh;
    background-image: url("../assets/img/cloud00.jpg");

    background-size: cover;
    background-position: bottom;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .banner #text {
    position: relative;
    font-size: 50px;
    color: #fff;
  }

  .banner .clouds {
    position: absolute;

    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

  }

  .banner .clouds img {
    position: absolute;

    bottom: 0;
    max-width: 100%;
    animation: animate calc(3s * var(--i)) linear infinite;
  }

  section {

    position: relative;
    padding: 40px 80px;
    font-size: 12px;
  }

  section h2 {
    position: relative;
    font-size: 16px;
    margin-bottom: 25px;

  }
}

@keyframes animate {
  0%{
    opacity:0;
    transform: scale(1);

  }
  25%,75%{
    opacity: 1;

  }
  100%{
    opacity:0;
    transform: scale(3);
  }
}
</style>