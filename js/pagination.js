export default {
    props: ['pages', 'getProducts'],
    template: `
    <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{disabled:!pages.has_pre}"> <!-- 如果沒有前一頁就disabled 前面是套用的名稱/後面是判斷式 -->
        <a @click="getProducts(pages.current_page - 1)" class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="page in pages.total_pages" :key="page + 123" :class="{active: page === pages.current_page}">
        <a @click="getProducts(page)" class="page-link" href="#">{{ page }}</a>
      </li>
      <li class="page-item" :class="{disabled:!pages.has_next}"><!-- 如果沒有後一頁就disabled -->
        <a @click="getProducts(pages.current_page + 1)" class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span> 
        </a>
      </li>
    </ul>
  </nav>
  `
}