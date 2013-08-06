require! {"../lib/vicquery"}

div \hello_world "Hello World!"

(G \hello_world) do
	x: -> $(window).width! * 0.5
	y: -> $(window).height! * 0.5 + Math.sin(Date.now! / 1000) * 100
	b: 2
	bgc: 'rgb(220,220,255)'
