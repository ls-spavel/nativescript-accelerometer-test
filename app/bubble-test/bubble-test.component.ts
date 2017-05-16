import { Component, OnDestroy, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";
import { AbsoluteLayout } from 'ui/layouts/absolute-layout'

import * as accelerometer from 'nativescript-accelerometer';

@Component({
	selector: "ns-bubble-test",
	moduleId: module.id,
	styleUrls: ['./bubble-test.component.css'],
	templateUrl: "./bubble-test.component.html",
})
export class BubbleTestComponent implements OnInit, OnDestroy {
	@ViewChild('absLayout') public absLayout: ElementRef
	@ViewChild('bubble') public bubbleImage: ElementRef

	private x: number = 0;
	private y: number = 0;
	private z: number = 0;

	constructor(
		private zone: NgZone
	) {
	}

	ngOnInit(): void {
		this.accelerate();
	}

	ngOnDestroy() {
		accelerometer.stopAccelerometerUpdates();
	}

	private accelerate(): void {
		accelerometer.startAccelerometerUpdates((data) => {
			let deltaX = Math.abs(this.x - data.x);
			let deltaY = Math.abs(this.y - data.y);
			let deltaZ = Math.abs(this.z - data.z);

			if (Math.max(deltaX, deltaY, deltaZ) >= .05) {
				console.log("x: " + data.x + "y: " + data.y + "z: " + data.z);
				this.x = this.round(data.x, 4);
				this.y = this.round(data.y, 4);
				this.z = this.round(data.z, 4);
				this.updateCircle();
			}
		})
	}

	private dotLeft = 0;
	private dotTop = 0;
	private updateCircle(): void {
		if (this.absLayout) {
			let layout: AbsoluteLayout = this.absLayout.nativeElement;
			let bubble = this.bubbleImage.nativeElement;

			let size = layout.getActualSize();
			let bubbleSize = bubble.getActualSize();

			this.zone.run(() => {
				this.dotLeft = (size.width / 2) + ((size.width / 2) * (+this.x * -1)) - (bubble.width / 2);
				this.dotTop = (size.height / 2) + ((size.height / 2) * +this.y) - (bubble.height / 2);
			});			
		}
	}

	private round(value, precision) {
		var multiplier = Math.pow(10, precision || 0);
		return Math.round(value * multiplier) / multiplier;
	}

	private isValidTilt(val): boolean {
		return Math.abs(val) <= .05;
	}

	private isValidOrientation(): boolean {
		return this.isValidTilt(this.x) && this.isValidTilt(this.y) && +this.z <= -.5;
	}
}
