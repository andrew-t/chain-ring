document.addEventListener('DOMContentLoaded', e => {
	const imgContainer = document.getElementById('image');
	const images = [],
		promises = [];
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

	function update() {
		const pos = window.scrollX / window.window.scrollMaxX;
		let frame = Math.floor((1 - pos) * images.length);
		if (frame < 0) frame = 0;
		if (frame >= images.length) frame = images.length - 1;
		images.forEach((img, f) => {
			img.style.display = (f == frame)
				? 'block' : 'none';
		});
	}

	Promise.all(promises)
		.then(() => {
			document.addEventListener('scroll', update);
			window.addEventListener('scroll', update);
			document.body.addEventListener('scroll', update);
			window.addEventListener('resize', update);
			window.scroll(window.scrollMaxX, 0);
			document.getElementById('loading').style.display = 'none';
		})
		.catch(e => {
			console.error(e);
			document.body.innerHTML = 'Failed to load images; try reloading the page?';
		});
});
