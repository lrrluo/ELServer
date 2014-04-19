ELServer
========

angular + nodejs+ express +mongoose 的便民网站后端部分

angular + nodejs+ express +mongoose 基于上面几个技术来开发一个方便查询的网站，就是一个集多个功能一身的小程序，其中分两部分，一部分是前端的ng,后端是nodejs--express,我分两部分的意思是想把前面的做成app，利用phonegap打包，然后后面做数据处理，前端的ui是用bootstrape 主要的功能是想集---快递查询，广州实时公交的查询，天气的查询，体育直播时间表，还有火车的查询等等吧，主要是为了便民，集大功能于一身，这些服务的来源都是web service或直接网站的请求返回数据，对于某些实时性不高的数据就会保存在mongodb里，其实做这个小项目的目的更多在于让自己练习js nodejs ngjs这几个技术，前端现在主要是利用jsonp来请求数据了.

现在这一部分是后端的部分，是基于nodejs + express + mongoose 来开发。

现在重新在server 这边加了一个 webapp(ng+bt)基于jade 模块来开发，这样就不用jsonp的方式，做完这个以后可能会加个手机端。

现在这个项目 已经发布在百度云上了,rirong.duapp.com
