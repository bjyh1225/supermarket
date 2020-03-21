<template>
    <div id="detail">
        <detail-nav-bar
            class="detail-nav"
            @titleClick="titleClick" 
            ref="nav"
        />
        <scroll
            class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3"
        >
           
            <detail-swiper :top-images="topImages"/>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shop" />
            <detail-goods-info
                :detail-info="detailInfo"
                @imageLoad="imageLoad"    
            />
            <detail-param-info ref="params" :param-info="paramInfo"/>
            <detail-comment-info ref="comment" :comment-info="commentInfo" />
            <goods-list ref="recommend" :goods="recommends" />
        </scroll>
        <detail-bottom-bar @addCart="addToCart" />
        <back-top
            @click.native="backClick"
            v-show="isShowBackTop"
        />
        <!-- <toast :message="message" :show="show" /> -->
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'
    
    import { getDetail, Goods, Shop, GoodsParam, Recommend, getRecommend } from 'network/detail'
    import { debounce } from 'common/utils'
    import { itemListenerMixin,backClick } from 'common/mixin'
    // import { BACKTOP_DISTANCE } from 'common/const'

    import Scroll from 'components/common/scroll/Scroll'
    import GoodsList from 'components/content/goods/GoodsList'
    // import Toast from 'components/common/toast/Toast'
    
    import { mapActions } from 'vuex'

    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            Scroll,
            GoodsList,
            // Toast
        },
        mixins: [itemListenerMixin,backClick],
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommends: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0,
                // message:'',
                // show:false
            }
        },
        created() {
            //1.保存传入的iid
            this.iid =  this.$route.params.iid
        
            //2.根据传入的iid请求数据
            getDetail(this.iid).then(res => {
                //1.获取顶部图片轮播
                
                const data = res.result;
                this.topImages = data.itemInfo.topImages    
                //2.获取商品信息
                this.goods = new Goods (data.itemInfo,data.columns,data.shopInfo.services)
                //3.创建店铺信息对象
                this.shop = new Shop (data.shopInfo)
                //4.保存商品的详情数据
                this.detailInfo = data.detailInfo;
                //5.获取参数信息
                this.paramInfo = new GoodsParam (data.itemParams.info,data.itemParams.rule)
                //6.取出评论参数信息
                if (data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list[0]
                }   
            }) 
            //3.请求推荐数据
            getRecommend().then( res => {
               this.recommends = res.data.list
            })
            //4.给getThemeTopY赋值
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = [];
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                this.themeTopYs.push(Number.MAX_VALUE)
            },100)
        },
        methods: {
            ...mapActions (['addCart']),
            imageLoad() {
                this.$refs.scroll.refresh()
                this.getThemeTopY()
            },
            titleClick(index) {
                this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
            },
            contentScroll(position) {
                //1.获取y值
                const positionY = -position.y
                //2.positionY和主题进行比较
                let length = this.themeTopYs.length
                for( let i = 0; i < length-1; i++ ) {
                    //1.普通做法
                    // if (this.currentIndex !== i &&
                    //     (( i < length-1 &&
                    //     positionY >= this.themeTopYs[i] &&
                    //     positionY < this.themeTopYs[i+1]) ||
                    //     ( i === length-1 && 
                    //     positionY >= this.themeTopYs[i]))) {
                    //         this.currentIndex = i;
                    //         this.$refs.nav.currentIndex = this.currentIndex 
                    // }
                    
                    //2.hack简单做法
                    if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
                         this.currentIndex = i;
                         this.$refs.nav.currentIndex = this.currentIndex 
                    }

                }

                //3.是否显示返回顶部
                 this.isShowBackTop = (-position.y) > 1000
            },
            addToCart() {
                //1添加购物车需要的信息
                const product = {};
                product.img = this.topImages[0];
                product.title = this.goods.titles;
                product.desc = this.goods.desc;
                product.price = this.goods.realPrice;
                product.iid = this.iid;

                this.addCart(product).then(res => {
                //   this.show = true;
                //   this.message = res;
                  
                //   setTimeout(() => {
                //      this.show = false;
                //      this.message = '' 
                //   }, 1500);
                   this.$toast.show()
                })
                //2.将商品添加到购物车里
                // this.$store.commit('addCart',product)
                // this.$store.dispatch('addCart',product).then(res => {
                //     console.log(res);
                // })
            }
        },
        mounted() {
            
        },
        destroyed() {
            this.$bus.$off('itemImageLoad', this.itemImgListener )
        }

    }
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 9;
        background: #fff;
        height: 100vh;
    }

    .detail-nav {
        position: relative;
        z-index: 9;
        background: #fff;
    }

    .content {
        height: calc(100% - 44px - 49px);
    }
</style>