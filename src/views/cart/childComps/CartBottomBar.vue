<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button
                class="check-button"
                :is-checked="isSelectAll"
                @click.native = "checkClick"
            />
            <span>全选</span>
        </div>
        <div class="price">
            合计：{{totalPrice}}
        </div>
        <div class="calculate"
             @click="calcClick"
        >
            去结算：({{ checkLength }})
        </div>
    </div>
</template>
<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import { mapGetters } from 'vuex'

export default {
    name: "CartBottomBar",
    components: {
        CheckButton
    },
    computed: {
        ...mapGetters(['cartList']),
        totalPrice() {
            return '¥' + this.cartList.filter(item => {
                return item.checked
            }).reduce((preValue,item) => {
                return preValue + item.price * item.count
            },0).toFixed(2)
        },
        checkLength(){
            return this.cartList.filter(item => item.checked).length
        },
        isSelectAll(){
            if(this.cartList === 0) return false
            // return !(this.cartList.filter(item => !item.checked).length)
            return !this.cartList.find(item => !item.checked)
        },
    },
    methods:{
        checkClick() {
            if(this.isSelectAll) {
                this.cartList.forEach(item => item.checked = false);
            }else{ 
                this.cartList.forEach(item => item.checked = true);
            }  
        },
        calcClick() {
            if(!this.isSelectAll) {
                this.$toast.show('请选择购买的商品',2000)
            }
        }
    }

}
</script>

<style scoped>
    .bottom-bar {
        position: relative; 
        display: flex;
        height: 40px;
        line-height: 40px;  
        background-color: #eee;         
    }
    .check-content {
        display: flex;
        align-items: center;
        margin-left: 8px;
        width: 70px;
    }
    .check-button {
        width: 20px;
        height: 20px;
         line-height: 20px;
         margin-right: 8px; 
    }
    .price {
        margin-left: 25px;
        flex: 1;
    }
    .calculate {
        width: 110px;
        background: red;
        color: #fff;
        text-align: center;
    }
</style>