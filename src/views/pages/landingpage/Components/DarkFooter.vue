<script setup lang="ts">
import { shallowRef } from 'vue';
// icons
import { TwitterOutlined, InstagramFilled, LinkedinFilled, FacebookFilled } from '@ant-design/icons-vue';

import LogoFooter from '@/assets/images/landing/codedthemes-logo.svg';

// to-do link add
const list1 = shallowRef([
  {
    name: 'Blog',
    link: ''
  },
  {
    name: 'Documentation',
    link: ''
  },
  {
    name: 'Change Log',
    link: ''
  },
  {
    name: 'Support',
    link: 'https://codedthemes.support-hub.io/'
  }
]);
const list2 = shallowRef([
  {
    name: 'License',
    link: ''
  },
  {
    name: 'Refund Policy',
    link: ''
  },
  {
    name: 'Submit a Request',
    link: ''
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
  <v-footer class="bg-dark text-white py-md-16 py-8 flex-column main-footer">
    <v-row>
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
.main-footer {
  .v-container:not(.v-container--fluid) {
    max-width: 1500px;
  }
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
</style>
