import { mapGetters } from "vuex";
import * as MutationTypes from '@/store/mutation-types';
export default {
  computed: {
    ...mapGetters(['nodeIdList']),
  },
  methods: {
    saveItemId(itemList = []) {
      const result = [];
      itemList.forEach(item => {
        const { id } = item;
        if (!this.nodeIdList.includes(id)) {
          this.nodeIdList.push(id);
          result.push(item);
        }
      });
      this.$store.commit(MutationTypes.SET_NODE_IDS, this.nodeIdList);
      return result;
    },
  },
};
