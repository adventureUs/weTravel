SUGGESTIONS

* Manage the tabs in a different way in Dashboard.jsx
* changeTabs is a higher order function?


* comment out lines 20 - 23 -->  in Chat.jsx because a chatRef will always exist even if chatlog does not exist

* chat updateScroll --> use a ref

* create  a message in the log with a ref, before push,

this.state.shouldScroll with push key, when ref callback gets called, look to see if you shouldScroll to that element

updateScroll() in listener  line 61
