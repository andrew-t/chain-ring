document.addEventListener('DOMContentLoaded', e => {
	const imgContainer = document.getElementById('image'),
		hiddenImgContainer = document.getElementById('constant-image');
	const images = [],
		promises = [];
	let allLoaded = false,
		maxScroll;
	for (let f = 302; f < 419; ++f) {
		const img = document.createElement('img');
		img.setAttribute('src', `img/img0${f}.jpg`);
		images.push(img);
		imgContainer.appendChild(img);
		promises.push(new Promise((resolve, reject) => {
			img.addEventListener('load', e => resolve());
			img.addEventListener('error', e => reject(e));
		}));
	}
	// Copy the images into another layer which is
	// always "visible" so the browser doesn't unload them:
	hiddenImgContainer.innerHTML = imgContainer.innerHTML;

	function update() {
		const pos = window.scrollX / maxScroll;
		let frame = Math.floor((1 - pos) * images.length);
		console.log(frame);
		if (frame < 0) frame = 0;
		if (frame >= images.length) frame = images.length - 1;
		images.forEach((img, f) => {
			if (f == frame)
				img.classList.remove('hidden');
			else
				img.classList.add('hidden');
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
