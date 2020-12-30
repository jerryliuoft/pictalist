import { Component, OnInit } from '@angular/core';
import {Title, Meta} from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  data = {
    name: 'Jerry Li',
    bio: 'Just another developer',
    image:'https://static.wikia.nocookie.net/gundam/images/a/a5/Gundam_SEED_Novel_vol._1_Cover.jpg/revision/latest?cb=20190310154657'
  }
  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle(this.data.name);
    this.meta.addTags([
      {name: 'twitter:card', content: 'summary'},
      {name: 'og:url', content: '/about'},
      {name: 'og:title', content: this.data.name},
      {name: 'og:description', content: this.data.bio},
      { name: 'og:image', content: this.data.image}
    ])
  }

}
