<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 1 page" />
      <p>{{ enabled }}</p>
      <p>{{ isConnected }}</p>
      <p></p>
      <div class="button" @click="btGetList">btGetList</div>
      <div class="button" @click="ax">axios</div>
      <div class="button" @click="btConnectCheck">btConnectCheck</div>
      <div class="button" @click="btSend">btSend</div>
      <div
        class="button"
        v-for="device in list"
        :key="device.address"
        @click="btConnect(device.address)"
      >
        {{ device.name }}
      </div>
      <p>{{ list }}</p>
      <input type="color" id="color" />
      <button @click="color()">colorSend</button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";

import axios from "axios";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

export default {
  name: "Tab1",
  components: {
    ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
  },
  data() {
    return {
      enabled: null,
      isConnected: null,
      text: "text",
      list: {}, // {name:'', address:'', id:'', class:''}
    };
  },
  methods: {
    async btGetList(): Promise<void> {
      await BluetoothSerial.isEnabled()
        .then(() => {
          (this as any).enabled = true;
        })
        .catch(async () => {
          (this as any).enabled = false;
          await BluetoothSerial.enable().then(() => {
            (this as any).enabled = true;
          });
        });

      if ((this as any).enabled) {
        (this as any).list = await BluetoothSerial.list();
      }
    },
    async btConnectCheck(): Promise<void> {
      await BluetoothSerial.isConnected()
        .then(async () => {
          alert("connect");
          (this as any).isConnected = true;
        })
        .catch(async () => {
          alert("disconnect");
          (this as any).isConnected = false;
        });
    },
    async btConnect(address: string): Promise<void> {
      alert(address);
      BluetoothSerial.connect(address).subscribe((success) => {
        alert(success);
      });
      //alert(connect._isScalar);
    },
    async btSend(text: string): Promise<void> {
      await BluetoothSerial.write(text)
        .then(async () => {
          //alert("send");
        })
        .catch(async () => {
          //alert(e);
        });
    },
    async color(): Promise<void> {
      const cc: string = (document.getElementById("color") as HTMLInputElement)
        .value;
      const red = parseInt(cc[1] + cc[2], 16);
      const green = parseInt(cc[3] + cc[4], 16);
      const blue = parseInt(cc[5] + cc[6], 16);
      this.btSend(`0,${(red / 255) * 1024};`);
      this.btSend(`1,${(green / 255) * 1024};`);
      this.btSend(`2,${(blue / 255) * 1024};`);
    },
  },
  ax() {
    alert("axios");
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((res) => {
        alert(res.status);
        alert(res.data);
        alert(JSON.stringify(res.data));
      })
      .catch((err) => {
        alert(err);
      });
  },
};
</script>

<style scoped>
.button {
  height: 100px;
  width: 100px;
  background-color: magenta;
}
</style>