class MandelbrotBounds {
	public Bottom: number;
	public Left: number;
	public Right: number;
	public Top: number;

	public getRadius(): number {
		if (Math.abs(this.Bottom) + Math.abs(this.Top) >
			Math.abs(this.Left) + Math.abs(this.Right)) {
			return Math.abs(this.Bottom) + Math.abs(this.Top);
		} else {
			return Math.abs(this.Left) + Math.abs(this.Right);
		}
	}
}