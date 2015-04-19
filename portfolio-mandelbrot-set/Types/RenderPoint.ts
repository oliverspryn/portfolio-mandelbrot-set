class RenderPoint {
	public Iterations: number;
	public X: number;
	public Y: number;
	public Zoom: number;
	
	constructor(x: number, y: number, zoom: number, iterations: number) {
		this.Iterations = iterations;
		this.X = x;
		this.Y = y;
		this.Zoom = zoom;
	}	
} 