document.addEventListener('DOMContentLoaded', e => {
	const imgContainer = document.getElementById('image'),
		images = [],
		promises = [],
		canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');
	let allLoaded = false,
		maxScroll;
	for (let f = 302; f < 419; ++f) {
		console.log('Loading image ' + f);
		const img = new Image();
		img.src = `img/img0${f}.jpg`;
		images.push(img);
		promises.push(new Promise((resolve, reject) => {
			img.addEventListener('load', e => {
				console.log('Loaded image ' + f);
				resolve();
			});
			img.addEventListener('error', e => {
				console.error('Error loading image ' + f, e);
				reject(e);
			});
		}));
	}

	function update() {
		const pos = window.scrollX / maxScroll;
		let frame = Math.floor((1 - pos) * images.length);
		console.log(frame);
		if (frame < 0) frame = 0;
		if (frame >= images.length) frame = images.length - 1;
		images.forEach((img, f) => {
			if (f == frame)
				ctx.drawImage(img, 0, 0);
		});
	}

	function resize() {
		maxScroll = Math.max(
			window.scrollMaxX || 0,
			(document.body.scrollWidth || 0) - window.innerWidth,
			(document.getElementById('scroller').scrollWidth || 0) - window.innerWidth);
		if (allLoaded)
			update();
	}
	window.addEventListener('resize', resize);

	Promise.all(promises)
		.then(() => {
			allLoaded = true;
			resize();
			document.addEventListener('scroll', update);
			window.addEventListener('scroll', update);
			document.body.addEventListener('scroll', update);
			window.addEventListener('resize', update);
			window.scroll(maxScroll, 0);
			document.getElementById('loading').style.display = 'none';
		})
		.catch(e => {
			console.error(e);
			document.body.innerHTML = 'Failed to load images; try reloading the page?';
		});
});
