import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
} from "@ionic/react";

import React, { useState, useEffect } from "react";

import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";

import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
const bluetoothSerial = BluetoothSerial;

const Tab1: React.FC = () => {
  let [enabled, enabledSet] = useState(false);
  let [list, listSet] = useState<
    { name: string; address: string; id: string; class: Number }[]
  >([]);
  let [status, statusSet] = useState("接続デバイスがありません");

  let [debug, debugSet] = useState("debugArea ");

  const isConnected = () => {
    bluetoothSerial
      .isConnected()
      .then((success) => {
        statusSet(success);
      })
      .catch((failure) => {
        statusSet(failure);
      });
  };

  const btGetList = async (): Promise<void> => {
    await bluetoothSerial
      .isEnabled()
      .then(async (success) => {
        enabled = true;
      })
      .catch(async (failure) => {
        enabled = false;
        alert(`${failure}\nBluetoothをONにしてください`);
        await bluetoothSerial.enable();
      });
    if (enabled) {
      listSet(await bluetoothSerial.list());
    }
  };
  btGetList();

  const btConnect = async (address: string) => {
    bluetoothSerial.connect(address).subscribe((success) => {
      alert(success);
      isConnected();
    });
  };

  const btSend = async (text: string) => {
    await bluetoothSerial
      .isConnected()
      .then(async () => {
        await bluetoothSerial
          .write(text)
          .then(async () => {
            //alert("send");
          })
          .catch(async (failure) => {
            alert(failure);
          });
      })
      .catch(async (failure) => {
        alert("デバイスが接続がされていません");
      });
  };

  /*
  bluetoothSerial.subscribe('\n').subscribe((data)=>{
    alert(`receive\n${data}`)
  })
  */
  useEffect(() => {
    setInterval(() => {
      isConnected();
    }, 1000);
  }, []);

  const color = () => {
    const cc: string = (document.getElementById("color") as HTMLInputElement)
      .value;
    const red = parseInt(cc[1] + cc[2], 16);
    const green = parseInt(cc[3] + cc[4], 16);
    const blue = parseInt(cc[5] + cc[6], 16);
    btSend(`0,${(red / 255) * 1024};`);
    btSend(`1,${(green / 255) * 1024};`);
    btSend(`2,${(blue / 255) * 1024};`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
        <p>{debug}</p>
        <IonButton onClick={btGetList}>デバイス再検索</IonButton>
        <br></br>
        <select id="deviceSelect">
          {list.map((v) => {
            return <option value={v.address}>{v.name}</option>;
          })}
        </select>
        <br></br>
        <IonButton
          onClick={() => {
            btConnect(
              (document.getElementById("deviceSelect") as HTMLInputElement)
                .value
            );
          }}
        >
          接続
        </IonButton>
        <br />
        <h3>接続ステータス</h3>
        {status}

        <br />
        <textarea id="textArea"></textarea>
        <IonButton
          onClick={() => {
            btSend(
              (document.getElementById("textArea") as HTMLInputElement).value
            );
          }}
        >
          送信
        </IonButton>
        <br />
        <br />
        <input type="color" id="color"></input>

        <IonButton onClick={color}>color</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
