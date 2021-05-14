import { useEffect, useState, useRef } from "react";
import { isFunction } from 'lodash';

export function useResizeObserver(targetRef, query?: Function) {
	const [contentRect, setContentRect] = useState({});
	const resizeObserver = useRef(null);
	
	if(!isFunction(query)){
		query = (current: any)=>(current)
	}

	useEffect(() => {
		if ("ResizeObserver" in window) {
			observe(ResizeObserver);
		} else {
			import("resize-observer-polyfill").then(observe);
		}

		function observe(ResizeObserver) {
			resizeObserver.current = new ResizeObserver((entries: any) => {
				const { width, height, top, right, bottom, left } = entries[0].contentRect;
				setContentRect({ width, height, top, right, bottom, left });
			});
			if (targetRef.current) {
				// resizeObserver.current.observe(targetRef.current.firstChild);
				resizeObserver.current.observe(query(targetRef.current));
			}
		}

		return disconnect;
	}, [targetRef]);

	function disconnect() {
		if (resizeObserver.current) {
			// resizeObserver.current.firstChild.disconnect();
			query(resizeObserver.current).disconnect();
		}
	}

	return contentRect;
}
