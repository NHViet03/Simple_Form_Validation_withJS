const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const introImg=$('.intro-img');
const imgPagination=$('.img-pagination');
const btnImgBack=$('.intro .btn-back');
const btnImgNext=$('.intro .btn-next');
const imgAnimate = introImg.animate(
    {
        opacity: [0, 1],
        transform: ["translateX(-60px)", "translateX(0%)"],
    },{
        duration:500,
        iterations:1
    }
);
// initialization List Image
const silerImage= {
    currentIndex:0,
    listImages:[
        {
            name:'Image 1',
            path:"./assets/img/store1.jpg"
        },
        {
            name:'Image 2',
            path:"./assets/img/store2.jpg"
        },
        {
            name:'Image 3',
            path:"./assets/img/store3.jpg"
        },
        {
            name:'Image 4',
            path:"./assets/img/store4.jpg"
        },
    ],
    handleEvents(){
        const _this=this;
        // Xu ly khi click Back Button
        btnImgBack.onclick=function(){
            _this.currentIndex=(_this.currentIndex - 1 + _this.listImages.length)%_this.listImages.length;
            _this.loadImage();
            _this.loadPagination();
        }
        // Xu ly khi click Next Button
        btnImgNext.onclick=function(){
            _this.currentIndex=(_this.currentIndex + 1)%_this.listImages.length;
            _this.loadImage();
            _this.loadPagination();
        }
    },
    loadImage(){
        introImg.src=this.listImages[this.currentIndex].path;
        imgAnimate.play();
    },
    renderPagination(){
        var htmls="";
        for(var i=0;i<this.listImages.length;i++){
            htmls+=`
            <span class="img-index ${i==this.currentIndex?'active':''}">
            <i class="fa-solid fa-circle img-index-fill"></i>
            <i class="fa-regular fa-circle img-index-empty"></i>
            </span>
            `
        }
        imgPagination.innerHTML=htmls;
    },
    loadPagination(){
        $('.img-index.active').classList.remove('active');
        $(`.img-index:nth-child(${this.currentIndex+1})`).classList.add('active');
    },
    start(){
        this.loadImage();
        this.renderPagination();
        this.handleEvents();
    }
}

silerImage.start();


// Show And Hide Password
const listShowHidePassword=$$('.form-group .show-hide-password');

listShowHidePassword.forEach(element => {
    element.onclick=function(){
        var inputElement=this.parentElement.querySelector('.form-control');
        if(this.classList.contains('active')){
            inputElement.type="password";
            this.classList.remove('active');
        }else {
            inputElement.type="text";
            this.classList.add('active');
        }
    }
});


