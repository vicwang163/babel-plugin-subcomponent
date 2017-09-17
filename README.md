# babel-plugin-subcomponent


## before

import {ul,hello} from 'lubc'
import lubase from 'lubase'

## after

import ul from 'lubc/ul'
import hello from 'lubc/hello'
import lubase from 'lubase'

## Config
"plugins": [
  ["subcomponent",{
    "lubc":{
      "([a-zA-Z]+)":"wang/$1"
    }
  }]
]