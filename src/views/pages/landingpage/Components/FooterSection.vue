<script setup lang="ts">
import { shallowRef } from 'vue';

// icons
import { TwitterOutlined, SendOutlined, InstagramFilled, LinkedinFilled, FacebookFilled } from '@ant-design/icons-vue';

// assets
import LogoFooter from '@/assets/images/landing/codedthemes-logo.svg';
import imageDashboard from '@/assets/images/landing/img-footer.png';

// to-do link add
const list1 = shallowRef([
  {
    name: 'Blog',
    link: 'https://blog.mantisdashboard.io/'
  },
  {
    name: 'Documentation',
    link: 'https://codedthemes.gitbook.io/mantis-vuetify/'
  },
  {
    name: 'Change Log',
    link: 'https://codedthemes.gitbook.io/mantis-vuetify/changelog'
  },
  {
    name: 'Support',
    link: 'https://codedthemes.support-hub.io/'
  }
]);
const list2 = shallowRef([
  {
    name: 'License',
    link: 'https://store.vuetifyjs.com/pages/licensing-information'
  },
  {
    name: 'Refund Policy',
    link: 'https://store.vuetifyjs.com/policies/refund-policy'
  },
  {
    name: 'Submit a Request',
    link: 'https://codedthemes.com/contact/'
  }
]);
const list3 = shallowRef([
  {
    name: 'CodeIgniter',
    link: 'https://codedthemes.com/item/mantis-codeigniter-admin-template/'
  },
  {
    name: 'React MUI',
    link: 'https://mui.com/store/items/mantis-react-admin-dashboard-template/'
  },
  {
    name: 'Angular',
    link: 'https://codedthemes.com/item/mantis-angular-admin-template/'
  },
  {
    name: 'Bootstrap 5',
    link: 'https://codedthemes.com/item/mantis-bootstrap-admin-dashboard/'
  },
  {
    name: '.Net',
    link: 'https://codedthemes.com/item/mantis-dotnet-bootstrap-dashboard-template/'
  }
]);
const list4 = shallowRef([
  {
    name: 'Berry React Material',
    link: 'http://mui.com/store/previews/berry-react-material-admin/'
  },
  {
    name: 'Free Berry React',
    link: 'https://mui.com/store/previews/berry-react-material-admin-free/'
  },
  {
    name: 'Free Mantis React',
    link: 'https://github.com/codedthemes/mantis-free-react-admin-template'
  }
]);
const socialList = shallowRef([
  {
    icon: InstagramFilled,
    link: 'https://www.instagram.com/codedthemes/'
  },
  {
    icon: TwitterOutlined,
    link: 'https://x.com/codedthemes'
  },
  {
    icon: LinkedinFilled,
    link: 'https://in.linkedin.com/company/codedthemes'
  },
  {
    icon: FacebookFilled,
    link: 'https://www.facebook.com/codedthemes/'
  }
]);
</script>

<template>
  <v-footer class="bg-dark text-white py-md-16 py-8 flex-column position-relative main-footer">
    <v-row>
      <v-col cols="12">
        <v-img :src="imageDashboard" class="footerMedia d-md-block d-none" alt="dashboard" cover />
        <div class="pb-md-16 pb-2 roadmapFooter">
          <v-container>
            <v-row>
              <v-col cols="12" lg="6">
                <div class="text-md-start text-center">
                  <h6 class="text-subtitle-1">Roadmap</h6>
                  <h2 class="text-h2 font-weight-bold">Upcoming Release</h2>
                  <p class="text-h6">What is next? Checkout the Upcoming release of Mantis Vue.</p>
                  <v-btn
                    color="primary"
                    class="text-decoration-none mt-4"
                    target="_"
                    href="https://codedthemes.gitbook.io/mantis-vuetify/roadmap"
                  >
                    <template v-slot:append>
                      <SendOutlined />
                    </template>
                    Roadmap
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
      <v-col cols="12">
        <v-container>
          <v-row>
            <v-col lg="4" cols="12">
              <div class="contactDetails pr-lg-6">
                <img :src="LogoFooter" alt="logo" />
                <p class="mt-4 text-h6">
                  Since 2017, More than 50K+ Developers trust the CodedThemes Digital Product. Mantis Vue is Manage under their Experienced
                  Team Players.
                </p>
              </div>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-10 mb-4">Help</h5>
              <div class="d-flex flex-column footer-list">
                <a v-for="(list, i) in list1" :key="i" :href="list.link" class="text-h6" target="_blank">
                  {{ list.name }}
                </a>
              </div>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-10 mb-4">Store Help</h5>
              <div class="d-flex flex-column footer-list">
                <a v-for="(list, i) in list2" :key="i" :href="list.link" class="text-h6" target="_blank">
                  {{ list.name }}
                </a>
              </div>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-10 mb-4">Mantis Eco-System</h5>
              <div class="d-flex flex-column footer-list">
                <a v-for="(list, i) in list3" :key="i" :href="list.link" class="text-h6" target="_blank">
                  {{ list.name }}
                </a>
              </div>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <h5 class="text-h5 mb-md-10 mb-4">More Products</h5>
              <div class="d-flex flex-column footer-list">
                <a v-for="(list, i) in list4" :key="i" :href="list.link" class="text-h6" target="_blank">
                  {{ list.name }}
                </a>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-footer>
  <div class="sub-footer text-white py-4 main-footer">
    <v-container class="py-0">
      <v-row class="align-center">
        <v-col sm="6">
          <h6 class="text-subtitle-2 text-lightText mb-0">© Made with love by Team CodedThemes</h6>
        </v-col>
        <v-col sm="6" class="text-end">
          <v-btn v-for="(item, i) in socialList" :key="i" :href="item.link" target="_blank" icon variant="plain" size="small">
            <component :is="item.icon" :style="{ fontSize: '19px' }" />
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style lang="scss">
.bg-dark {
  background: #1f1f1f;
}
.footer-list {
  a {
    color: rgb(var(--v-theme-secondary));
    &:hover {
      color: rgb(var(--v-theme-primary));
      text-decoration: none;
    }
    + a {
      margin-top: 20px;
      @media (max-width: 991px) {
        margin-top: 10px;
      }
    }
  }
}
.sub-footer {
  background: #141414;
}
.footerMedia {
  width: 65%;
  max-width: 600px;
  position: absolute;
  top: -16%;
  right: 0;
  [dir='rtl'] & {
    right: unset;
    left: 0;
    transform: scaleX(-1);
  }
  @media (max-width: 1264px) {
    width: 60%;
    max-width: 520px;
  }
}
.main-footer {
  .v-container:not(.v-container--fluid) {
    max-width: 1500px;
  }
}
.roadmapFooter {
  position: relative;
  .v-container {
    position: relative;
    z-index: 1;
  }
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 80%;
    bottom: 0px;
    right: -16px;
    background: linear-gradient(transparent 0%, rgb(31, 31, 31) 70%);
    [dir='rtl'] & {
      right: unset;
      left: -16px;
    }
  }
}
</style>
