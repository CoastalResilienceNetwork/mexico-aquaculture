<template>
  <!--create site section -->
  <div class="q-pr-md">
    <div v-if="$store.state.userProcess.siteCreated == false">
      <div class="row">
        <div class="col-11">
          <p class="text-h6 text-primary q-mb-none">{{ lang.title }}</p>
          <p>
            {{ lang.description }}
          </p>
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

      <p class="text-subtitle2 q-mb-none q-mt-lg text-primary">
        {{ lang.select }}
      </p>
      <q-separator spaced />
      <div class="q-gutter-sm">
        <q-radio
          v-model="$store.state.userProcess.species"
          :disable="this.disableRadios"
          @update:model-value="setSpecies($event)"
          val="offshore"
          label="Costa afuera"
        />
        <q-radio
          v-model="$store.state.userProcess.species"
          :disable="this.disableRadios"
          @update:model-value="setSpecies($event)"
          val="onshore"
          label="Cerca de la costa"
        />
      </div>
      <div
        v-if="
          $store.state.userProcess.species !== 'none' &&
            $store.state.userProcess.drawStatus !== 'done-drawing'
        "
      >
        <p class="text-subtitle2 q-mb-none q-mt-lg text-primary">
          {{ lang.drawTitle }}
        </p>
        <q-separator spaced />
        <p>
          {{ lang.drawDescription }}
        </p>
        <q-btn
          size="md"
          color="secondary"
          id="draw-button"
          outline
          unelevated
          @click="drawExtent()"
          >{{ lang.drawButton }} &nbsp;
          <q-icon v-if="showDraw" name="draw" />
        </q-btn>
      </div>
      <div
        v-if="
          $store.state.userProcess.species !== 'none' &&
            $store.state.userProcess.drawStatus == 'done-drawing'
        "
      >
        <p class="text-subtitle2 q-mb-none q-mt-lg text-primary">
          {{ lang.reviewStatistics }}
        </p>
        <q-separator spaced />

        <q-expansion-item
          v-model="expanded3"
          :label="lang.siteStatistics"
          class="q-mb-md"
          dark
          header-class="bg-primary"
        >
          <site-statistics></site-statistics>
        </q-expansion-item>
      </div>
      <div v-if="$store.state.userProcess.drawStatus == 'done-drawing'">
        <p class="text-subtitle2 q-mb-none q-mt-lg text-primary">
          {{ lang.reviewParameters }}
        </p>
        <q-separator spaced />
        <q-expansion-item
          v-model="expanded1"
          :label="lang.siteParameters"
          class="q-mb-md"
          dark
          header-class="bg-primary"
        >
          <site-parameters></site-parameters>
        </q-expansion-item>
        <!--q-input outlined dense class="q-mb-md" v-model="name" label="Enter your site name"></q-input-->
        <p>{{ lang.createSiteDescription }}</p>
        <q-btn
          unelevated
          class="q-mr-md"
          color="secondary"
          @click="createSite()"
          >{{ lang.createButton }}</q-btn
        >
        <q-btn
          size="md"
          color="secondary"
          outline
          @click="clearUserProcess()"
          >{{ lang.reset }}</q-btn
        >
      </div>
    </div>

    <!-- site created section-->
    <div v-if="$store.state.userProcess.siteCreated == true">
      <p class="text-h6 text-primary q-mb-none">{{ lang.siteCreated }}</p>
      <p>
        {{ lang.siteCreatedDescription }}
      </p>
      <p class="text-subtitle2 text-primary q-mb-none q-mt-lg">
        {{ lang.createReport }}
      </p>
      <q-separator spaced />
      <p>{{ lang.createReportDescription }}</p>
      <q-btn outline unelevated color="secondary" @click="generateReport">{{
        lang.createReportButton
      }}</q-btn>
      <p class="text-subtitle2 text-primary q-mb-none q-mt-lg">
        {{ lang.copyURL }}
      </p>
      <q-separator spaced />
      <p class="text-caption">
        {{ lang.copyURLNote }}
      </p>
      <q-btn
        outline
        unelevated
        class="q-mb-md"
        color="secondary"
        @click="copyURL()"
        >{{ lang.copyURLButton }}
        <q-tooltip
          v-model="showTooltip"
          no-parent-event
          anchor="center right"
          self="center left"
          :offset="[10, 10]"
        >
          <q-icon name="content_copy" />
          Copied to clipboard
        </q-tooltip>
      </q-btn>
      <div class="bg-grey-3 q-pa-sm url-container">
        <a
          class="fitURL text-caption"
          :href="$store.state.userSiteMap.customURL"
          >{{ $store.state.userSiteMap.customURL }}
        </a>
      </div>
      <p class="text-subtitle2 q-mb-none q-mt-lg text-primary">
        {{ lang.reviewStatistics }}
      </p>
      <q-separator spaced />
      <q-expansion-item
        v-model="expanded4"
        :label="lang.siteStatistics"
        class="q-mb-md"
        header-class="bg-grey-3"
      >
        <site-statistics></site-statistics>
      </q-expansion-item>

      <p class="text-subtitle2 text-primary q-mb-sm q-mt-lg">
        {{ lang.reviewParameters }}
      </p>
      <q-separator spaced />
      <q-expansion-item
        v-model="expanded2"
        :label="lang.siteParameters"
        class="q-mb-md"
        header-class="bg-grey-3"
      >
        <site-parameters></site-parameters>
      </q-expansion-item>

      <br />
      <q-btn
        class="q-mt-xl"
        size="md"
        @click="clearUserProcess()"
        unelevated
        color="secondary"
        >{{ lang.createNew }}</q-btn
      >
      <p class="text-caption q-mt-sm">
        {{ lang.createNewNote }}
      </p>
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar';
import SiteParameters from './SiteParameters.vue';
import SiteStatistics from './SiteStatistics.vue';

export default {
  name: 'CreateArea',
  components: {
    SiteParameters,
    SiteStatistics,
  },
  props: ['parentRefs'],
  data() {
    return {
      expanded1: true,
      expanded2: false,
      expanded3: true,
      expanded4: false,
      name: '',
      userProcess: {
        siteCreated: false,
        species: 'none',
        drawStatus: 'reset',
        printStatus: 'reset',
      },
      showTooltip: false,
      disableRadios: false,
      showDraw: false,
    };
  },
  computed: {
    lang() {
      return this.$store.getters.langObj.createSite;
    },
  },
  mounted() {
    //gather variables from the store
    this.userProcess = this.$store.state.userProcess;
    //chcek the url to see if this is a users site, if so recreate it
    if (this.$route.query.corners) {
      let p = this.$route.query.corners.split(',');
      let corners = [
        [Number(p[0]), Number(p[1])],
        [Number(p[2]), Number(p[3])],
        [Number(p[4]), Number(p[5])],
        [Number(p[6]), Number(p[7])],
        [Number(p[8]), Number(p[9])],
      ];

      this.userProcess = {
        siteCreated: true,
        species: this.$route.query.species,
        drawStatus: 'reset',
        printStatus: 'reset',
      };
      this.$store.commit('updateUserProcess', this.userProcess);
      this.$store.commit('updateCustomURLCorners', corners);
      this.$store.commit('updateCustomURLSpecies', this.$route.query.species);
      this.$store.commit('makeSiteFromURL', corners);
    }
  },
  methods: {
    clearAllLayers() {
      this.$store.commit('clearLayers');
    },
    clearUserProcess() {
      this.expanded1 = true;
      this.expanded2 = false;
      this.name = '';
      this.disableRadios = false;
      this.showDraw = false;
      this.userProcess = {
        siteCreated: false,
        species: 'none',
        drawStatus: 'reset',
        printStatus: 'reset',
      };
      this.$store.commit('updateUserProcess', this.userProcess);
      this.$store.commit('updateSetTicked', {
        tick: [],
        untick: ['3_0', '4_0'],
      });
      this.$store.commit('clearUserResults');
      this.$router.push('create');
    },
    setSpecies(val) {
      if (val == 'offshore') {
        this.$store.commit('updateSetTicked', {
          tick: ['3_0'],
          untick: ['4_0'],
        });
        let layerObj = {
          value: 0.5,
          id: 3,
          mapServiceIndex: 0,
          type: 'Raster Layer',
        };
        this.$store.commit('updateSupportingLayerVisibleOpacity', layerObj);
      } else if (val == 'onshore') {
        this.$store.commit('updateSetTicked', {
          tick: ['4_0'],
          untick: ['3_0'],
        });
        let layerObj = {
          value: 0.5,
          id: 4,
          mapServiceIndex: 0,
          type: 'Raster Layer',
        };
        this.$store.commit('updateSupportingLayerVisibleOpacity', layerObj);
      }
      this.userProcess.species = val;
      this.$store.commit('updateUserProcess', this.userProcess);
    },
    generateReport() {
      this.userProcess.printStatus = 'printing';
      this.$store.commit('updateUserProcess', this.userProcess);
    },
    drawExtent() {
      this.userProcess.drawStatus = 'drawing';
      this.$store.commit('updateUserProcess', this.userProcess);
      this.showDraw = true;
      this.disableRadios = true;
    },
    createSite() {
      this.$store.commit(
        'updateCustomURLSpecies',
        this.$store.state.userProcess.species
      );
      this.userProcess.siteCreated = true;
      this.$store.commit('updateUserProcess', this.userProcess);
      this.parentRefs.panelC.setScrollPosition('vertical', 0);
    },
    copyURL() {
      copyToClipboard(this.$store.state.userSiteMap.customURL)
        .then(() => {
          // success!
          //show tooltip

          this.showTooltip = true;
          setTimeout(() => {
            this.showTooltip = false;
          }, 1000);
        })
        .catch(() => {
          // fail
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.url-container {
  width: 520px;
}
.fitURL {
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.cursor-crosshair {
  cursor: crosshair;
}

.cursor-pointer {
  cursor: pointer;
}

@media screen and (max-width: 700px) {
  .url-container {
    width: 420px;
  }
}
</style>
