import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare let Peer: any

@Component({
  selector: 'app-web-rtc',
  templateUrl: './web-rtc.component.html',
  styleUrls: ['./web-rtc.component.scss']
})
export class WebRtcComponent {

  chatMessage = '';
  peer: any;
  conn: any;
  myPeerId = '';
  otherPeerId = '';


  constructor() {
    // @ts-ignore
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      this.myPeerId = id;
    });
  }

  sentTextMessage() {
    if (this.chatMessage.trim().length > 0) {
      this.conn.send('Hello!');
    }
  }

  connectPeer() {
    if (this.otherPeerId.trim().length > 0) {
      this.conn = this.peer.connect(this.otherPeerId);
      this.conn.on('open', () => {
        // Receive messages
        console.clear();
        console.log('Connection Open');
        this.conn.on('data', (data) => {
          console.log('Received', data);
        });
        // Send messages
        this.conn.send('Hello!');
      });
    }
  }
}


/*
* Create WebRTC peer and setup event handlers : https://gist.github.com/bitsnaps/428558a78894ce28c0db1514fa19a314
* */
