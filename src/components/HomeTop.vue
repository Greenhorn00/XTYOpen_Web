<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "HomeTop",
  data(){
    return{
      i:1,
    }
  },
  methods: {
    setH2() {
      requestAnimationFrame(() => {
        let text = document.getElementById('text');
        let value = window.scrollY;
        text.style.marginBottom = value * 1.2 + 'px';
      });
    }
  },
  mounted() {
    window.addEventListener('scroll', this.setH2);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.setH2);
  }
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
      <h2 class="wow fadeInRightBig" style="display: flex;align-items: center;">

        XTY-Open source learning website

        <a href="https://github.com/Greenhorn00/XTYOpen_Web" target="_blank">
          <button class="Btn">
           <span class="svgContainer">
             <svg fill="white" viewBox="0 0 496 512" height="1.6em"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
           </span>
            <span class="BG"></span>
          </button>
        </a>
        <a href="https://www.facebook.com/profile.php?id=100091770885571" target="_blank">
          <button class="Btn">
          <span class="svgContainer">
            <svg
                viewBox="0 0 320 512"
                height="1.3em"
                xmlns="http://www.w3.org/2000/svg"
                class="svgIcon"
                fill="white"
            >
              <path
                  d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
              ></path>
            </svg>
          </span>
            <span class="BG" style="background: #1877f2;"></span>
          </button>
        </a>
        <a href="https://u.wechat.com/gCqJxk1iOM0rURyME_RRjjE" target="_blank">
          <button class="Btn">
            <span class="svgContainer">
              <svg class="icon" height="1.8em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M690.1 377.4c5.9 0 11.8 0.2 17.6 0.5-24.4-128.7-158.3-227.1-319.9-227.1C209 150.8 64 271.4 64 420.2c0 81.1 43.6 154.2 111.9 203.6 5.5 3.9 9.1 10.3 9.1 17.6 0 2.4-0.5 4.6-1.1 6.9-5.5 20.3-14.2 52.8-14.6 54.3-0.7 2.6-1.7 5.2-1.7 7.9 0 5.9 4.8 10.8 10.8 10.8 2.3 0 4.2-0.9 6.2-2l70.9-40.9c5.3-3.1 11-5 17.2-5 3.2 0 6.4 0.5 9.5 1.4 33.1 9.5 68.8 14.8 105.7 14.8 6 0 11.9-0.1 17.8-0.4-7.1-21-10.9-43.1-10.9-66 0-135.8 132.2-245.8 295.3-245.8z m-194.3-86.5c23.8 0 43.2 19.3 43.2 43.1s-19.3 43.1-43.2 43.1c-23.8 0-43.2-19.3-43.2-43.1s19.4-43.1 43.2-43.1z m-215.9 86.2c-23.8 0-43.2-19.3-43.2-43.1s19.3-43.1 43.2-43.1 43.2 19.3 43.2 43.1-19.4 43.1-43.2 43.1z"></path><path d="M866.7 792.7c56.9-41.2 93.2-102 93.2-169.7 0-124-120.8-224.5-269.9-224.5-149 0-269.9 100.5-269.9 224.5S540.9 847.5 690 847.5c30.8 0 60.6-4.4 88.1-12.3 2.6-0.8 5.2-1.2 7.9-1.2 5.2 0 9.9 1.6 14.3 4.1l59.1 34c1.7 1 3.3 1.7 5.2 1.7 2.4 0 4.7-0.9 6.4-2.6 1.7-1.7 2.6-4 2.6-6.4 0-2.2-0.9-4.4-1.4-6.6-0.3-1.2-7.6-28.3-12.2-45.3-0.5-1.9-0.9-3.8-0.9-5.7 0.1-5.9 3.1-11.2 7.6-14.5zM600.2 587.2c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9c0 19.8-16.2 35.9-36 35.9z m179.9 0c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9c-0.1 19.8-16.2 35.9-36 35.9z"></path></svg>
            </span>
            <span class="BG" style="background: #23A463;"></span>
          </button>
        </a>
        <a href="https://qm.qq.com/q/yH0wQt7coE" target="_blank">
          <button class="Btn">
            <span class="svgContainer">
              <svg class="icon" height="1.8em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M849.621 619.904a1364.352 1364.352 0 0 0-28.8-80.47l-38.826-95.829c0-1.109 0.512-19.968 0.512-29.696 0-163.882-78.208-328.576-270.507-328.576S241.493 250.027 241.493 413.867c0 9.77 0.47 28.629 0.512 29.738l-38.826 95.83a1398.485 1398.485 0 0 0-28.8 80.469c-36.694 116.779-24.79 165.12-15.744 166.187 19.413 2.304 75.562-87.894 75.562-87.894 0 52.224 27.179 120.406 86.016 169.643-21.973 6.699-48.938 17.024-66.304 29.653-15.573 11.392-13.61 23.04-10.794 27.734 12.33 20.522 211.413 13.098 268.928 6.698 57.472 6.4 256.597 13.824 268.885-6.741 2.816-4.693 4.779-16.299-10.795-27.69-17.365-12.63-44.33-22.955-66.346-29.697 58.837-49.194 86.016-117.376 86.016-169.642 0 0 56.149 90.24 75.562 87.893 9.046-1.067 20.907-49.365-15.786-166.144" fill="#CDCDCD"></path></svg>
            </span>
            <span class="BG" style="background: #3d3d3d;"></span>
          </button>
        </a>

      </h2>
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

.Btn {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  position: relative;
  /* overflow: hidden; */
  border-radius: 7px;
  cursor: pointer;
  transition: all .3s;

  margin-left: 10px;
}

.svgContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  backdrop-filter: blur(0px);
  letter-spacing: 0.8px;
  border-radius: 10px;
  transition: all .3s;
  border: 1px solid rgba(156, 156, 156, 0.466);
}

.BG {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background: #181818;
  z-index: -1;
  border-radius: 10px;
  pointer-events: none;
  transition: all .3s;
}

.Btn:hover .BG {
  transform: rotate(35deg);
  transform-origin: bottom;
}

.Btn:hover .svgContainer {
  background-color: rgba(156, 156, 156, 0.466);
  backdrop-filter: blur(4px);
}

@media (min-width: 768px){
  .banner
  {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url("../assets/img/bg.jpg");
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
    background-image: url("../assets/img/bg.jpg");

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
    padding: 20px 10px;
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