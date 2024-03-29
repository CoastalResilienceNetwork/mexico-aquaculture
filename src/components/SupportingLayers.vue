<template>
  <div :class="displayClass" @click.stop @keypress.stop>
    <div class="row">
      <div class="col-11">
        <p class="text-subtitle2 text-primary q-mb-none">
          {{ lang.title }}
        </p>
        <p>{{ lang.description }}</p>
      </div>
      <div class="col-1">
        <q-btn
          flat
          round
          color="primary"
          icon="layers_clear"
          @click="clearAllLayers()"
        >
          <q-tooltip>{{ lang.clearLayers }}</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-input
      ref="filterRef"
      class="q-mb-md"
      outlined
      dense
      v-model="filter"
      :label="lang.filterDescription"
    >
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
    </q-input>
    <div v-if="showTree">
      <q-tree
        ref="tree"
        :nodes="treeData"
        node-key="id"
        tick-strategy="leaf"
        v-model:ticked="ticked"
        v-model:expanded="expanded"
        :filter="filter"
        style="overflow:hidden"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center" v-if="prop.node.icon">
            <div class="text-weight-bold text-primary">
              {{ prop.node.label }}
            </div>
            <q-btn
              @click.stop="clickedIcon(prop.node.id)"
              class="q-ml-sm"
              padding="none"
              color="primary"
              flat
              icon="info"
            />
          </div>
          <div class="row items-center" v-if="!prop.node.icon">
            <div class="">{{ prop.node.label }}</div>
          </div>
        </template>

        <template v-slot:body-toggle="prop">
          <div class="q-pa-none">
            <q-list class="">
              <q-expansion-item
                expand-icon-toggle
                dense
                dense-toggle
                label=""
                header-class="text-secondary"
                id="expandMore"
              >
                <q-card class="">
                  <q-scroll-area
                    v-if="prop.node.description"
                    style="height:50px; width:90%"
                    :thumb-style="{
                      background: 'var(--q-secondary)',
                      width: '4px',
                    }"
                  >
                    <div class="q-mr-md">
                      {{ prop.node.description }}
                    </div>
                  </q-scroll-area>

                  <div class="row items-left q-pa-sm">
                    <div class="col-1">
                      <q-icon color="secondary" name="opacity" size="xs" />
                    </div>
                    <div class="col-11 q-pr-xl">
                      <q-slider
                        color="secondary"
                        snap
                        dense
                        @change="
                          setTransparency($event, prop.node.id, prop.node.type)
                        "
                        :min="0"
                        :max="1"
                        :step="0.1"
                        :model-value="0.5"
                        label
                      />
                    </div>
                  </div>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupportingLayers',
  data() {
    return {
      layerList: '',
      showDescription: false,
      ticked: this.$store.state.tree.ticked,
      expanded: [999],
      showDialog_0: false,
      showDialog_24: false,
      showDialog_29: false,
      filter: '',
      filterRef: null,
      showTree: false,
      treeData: [],
    };
  },
  props: ['displayClass'],
  computed: {
    slReady() {
      return this.$store.state.data.slReady;
    },
    setTicked() {
      return this.$store.state.setTicked;
    },
    clearLayers() {
      return this.$store.state.clearLayers;
    },
    lang() {
      return this.$store.getters.langObj.supportingLayers;
    },
  },
  created() {
    if (this.slReady) {
      this.treeData = this.$store.state.data.supportingLayers;
      this.showTree = true;
    } else {
      this.$store.dispatch('requestSupportingLayers');
    }
  },
  watch: {
    slReady() {
      if (this.slReady) {
        this.treeData = this.$store.state.data.supportingLayers;
        this.showTree = true;
      }
    },

    ticked() {
      //get type and create ticked object with layer id and layer type to retrieve in map
      let tickedObj = [];
      for (let i = 0; i < this.ticked.length; i++) {
        let node = this.$refs.tree.getNodeByKey(this.ticked[i]);
        let type = node.type;
        let layerInfo = this.ticked[i].split('_');
        tickedObj.push({
          mapServiceIndex: layerInfo[1],
          id: layerInfo[0],
          type: type,
        });
      }
      this.$store.commit('updateTreeState', {
        tickedObj: tickedObj,
        ticked: this.ticked,
        expanded: this.expanded,
      });
    },
    setTicked() {
      let ticked = this.$store.state.tree.ticked;
      let tickedObj = [];
      this.setTicked.tick.forEach((item) => {
        if (!this.$store.state.tree.ticked.includes(item)) {
          ticked.push(item);
        }
      });
      this.setTicked.untick.forEach((item) => {
        if (this.$store.state.tree.ticked.includes(item)) {
          let i = ticked.indexOf(item);
          ticked.splice(i, 1);
        }
      });
      ticked.forEach((layer) => {
        let node = this.$refs.tree.getNodeByKey(layer);
        let type = node.type;
        let layerInfo = layer.split('_');
        tickedObj.push({
          mapServiceIndex: layerInfo[1],
          id: layerInfo[0],
          type: type,
        });
      });
      this.$store.commit('updateTreeState', {
        tickedObj: tickedObj,
        ticked: ticked,
        expanded: this.expanded,
      });
    },
    clearLayers() {
      this.ticked = [];
    },
  },
  methods: {
    setTransparency(value, id, type) {
      let layerInfo = id.split('_');
      let layerObj = {
        value: value,
        id: layerInfo[0],
        mapServiceIndex: layerInfo[1],
        type: type,
      };
      this.$store.commit('updateSupportingLayerVisibleOpacity', layerObj);
    },
    resetFilter() {
      this.filter = '';
      this.filterRef.focus();
    },
    clearAllLayers() {
      this.ticked = [];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.supportingLayersMap {
  background-color: white;
  max-height: calc(100vh - 120px);
  overflow-x: hidden;
  overflow-y: auto;
  min-width: 460px;
  padding: 20px;
}

.supportingLayersPanel {
  padding: 10px;
}
</style>
<style>
.q-tree__node-body {
  padding: 0px !important;
  top: -30px;
  margin-bottom: -30px;
  left: 25px;
  overflow: hidden;
}
</style>
