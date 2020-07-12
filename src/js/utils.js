export const getElem = (selector) => {
	return document.querySelectorAll(selector)
}

export const hidePreloader = (uniqueClassName) => {
	getElem('.preloader' + (uniqueClassName || '')).forEach(preloader => {
		preloader.classList.add('is-loaded');
	});

	setTimeout(() => {
		getElem('.preloader' + (uniqueClassName || '')).forEach(preloader => {
			preloader.style.display = 'none';
		});
	}, 500);
};
