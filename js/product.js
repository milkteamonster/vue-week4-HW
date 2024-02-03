import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
let productModal = null;
let delProductModal = null;

const App = {
data(){
    return { 
        apiUrl : 'https://ec-course-api.hexschool.io/v2',
        apiPath : 'milktea',
        products: [],
        isNew: false,
        tempProduct: {
            imagesUrl: [], //一開始就定義完整避免出錯
        },
        pages: {},
    }
},
mounted(){//要使用mounted 要抓到動元素，不然bootstrap modal裡的文字無法正常顯示 而且要先在上面設productModal, delProductModal為空物件，再用mounted取一次才行。
    //用refs寫
    // console.log(this.$refs)
    this.productModal = new bootstrap.Modal(this.$refs.productModal);
    this.delProductModal = new bootstrap.Modal(this.$refs.delProductModal);
    //用id寫
    // productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
    //     keyboard: false
    //   });
    // delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
    //     keyboard: false
    //   });

    //取出token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    axios.defaults.headers.common.Authorization = token;// 之後每次發出請求時會自動把headers加進去，每次重新整理還是會維持登入狀態
    this.checkAdmin()
},
methods: {
    //驗證登入
    checkAdmin(){
        const url = `${this.apiUrl}/api/user/check`;
        axios.post(url)
            .then(()=>{
                console.log('驗證成功')
                this.getProducts(); // 驗證成功就取得產品列表
            })
            .catch((err)=>{
                alert(err.response.data.message)
                location.href = "login.html";// 失敗就導回login頁面
            })
    },
    //取得管理員才能看到的產品列表
    getProducts(page = 1){ //參數預設值
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
        axios.get(url)
            .then((res)=>{
                this.products = res.data.products;
                console.log(res);
                this.pages = res.data.pagination;
            })
            .catch((err)=>{
                alert(err.response.data.message);  
            })
    }, 
    //更新產品資料
    updateProduct(){ //Modal中的「確認」按鈕
        //依據新增與編輯的不同決定要呼叫哪個api
        let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`; //要用let 因為會換掉
        let http = 'post' //若是新增  
        if(!this.isNew){ //若是編輯的判斷
            url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
            http = 'put'
        }
        axios[http](url, {data: this.tempProduct}) 
            .then((res)=>{
                alert(res.data.message);
                this.productModal.hide();//用refs有this時前面要加上this-> this.productModal.hide(), 用id寫則不用-> productModal.show()
                this.getProducts(); //重新取得一次產品列表
                this.tempProduct = {}; //清空輸入匡
            })
            .catch((err)=>{
                alert(err.response.data.message)  
            })
    },
    openModal(isNew, item){
        if (isNew === 'new'){ //新增
            this.tempProduct = {
                imagesUrl: [], //tempProduct會一直變動，為了確保是初始狀態所以要重寫一次
            };
            this.isNew = true;
            this.productModal.show(); //用refs有this時前面要加上this-> this.productModal.show(), 用id寫則不用-> productModal.show()
        } else if(isNew === 'edit'){ //編輯
            this.tempProduct = { ...item };//淺拷貝
            if(!Array.isArray(this.tempProduct.imagesUrl)){
                this.tempProduct.imagesUrl
            }
            this.isNew = false;
            this.productModal.show(); //用refs有this時前面要加上this-> this.productModal.show(), 用id寫則不用-> productModal.show()
        } else if (isNew === 'delete'){
            this.tempProduct = { ...item};//淺拷貝
            this.delProductModal.show(); //用refs有this時前面要加上this-> this.productModal.show(), 用id寫則不用-> productModal.show()
        }
    },
    //刪除產品資料
    delProduct(){
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        axios.delete(url)
        .then((res)=>{
            alert(res.data.message);
            this.delProductModal.hide(); //刪除後隱藏Modal
            this.getProducts();//重新取得一次產品列表
        })
        .catch((err)=>{
            alert(err.response.data.message);
        })
    },
    createImage(){
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
    }
},
};
Vue.createApp(App).mount('#app');
