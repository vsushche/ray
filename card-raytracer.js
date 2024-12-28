/**
 *  Special thanks to Paul Heckbert
 *
 *  http://tproger.ru/translations/business-card-raytracer
 */
'use strict';
const jpeg = require('jpeg-js');

class Vector {
	constructor(a, b, c) {
		this.x = a;
		this.y = b;
		this.z = c;
	}

	sum(r) {
		return new Vector(this.x + r.x, this.y + r.y, this.z + r.z);
	}

	prod(r) {
		return new Vector(this.x * r, this.y * r, this.z * r);
	}

	sprod(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	vprod(v) {
		return new Vector(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x
		);
	}

	norm() {
		const fix = 1 / Math.sqrt(
			this.x * this.x +
			this.y * this.y +
			this.z * this.z
		);

		return new Vector(this.x * fix, this.y * fix, this.z * fix);
		//return this.prod(1 / Math.sqrt(this.sprod(this)));
	}
}

const G = [
	0x0003C712,  // 00111100011100010010
	0x00044814,  // 01000100100000010100
	0x00044818,  // 01000100100000011000
	0x0003CF94,  // 00111100111110010100
	0x00004892,  // 00000100100010010010
	0x00004891,  // 00000100100010010001
	0x00038710,  // 00111000011100010000
	0x00000010,  // 00000000000000010000
	0x00000010,  // 00000000000000010000
];

const rnd = Math.random;

let v0 = new Vector(0, 0, 1);

function tracer(o, d, ctx) {
	ctx.t = 1e9;
	let m = 0;
	let p = -o.z / d.z;

	if (.01 < p) {
		ctx.t = p;
		ctx.n = v0;
		m = 1;
	}

	for (let k = 19; k--;) {
		for (let j = G.length; j--;) {
			if (G[j] & 1 << k) {
				let p = o.sum(new Vector(-k, 0, -j - 4));
				let b = p.sprod(d);
				let c = p.sprod(p) - 1;
				let q = b * b - c;
				if (q > 0) {
					let s = -b - Math.sqrt(q);
					if ((s < ctx.t) && (s > .01)) {
						ctx.t = s;
						ctx.n = p.sum(d.prod(ctx.t)).norm();
						m = 2;
					}
				}
			}
		}
	}
	return m;
}

let v1 = new Vector(.7, .6, 1);
let v2 = new Vector(3, 1, 1);
let v3 = new Vector(3, 3, 3);
let v4 = new Vector(0, 0, 0);

function sampler(o, d) {
	let ctx = {
		t: .0,
		n: null
	};

	let m = tracer(o, d, ctx);
	if (!m) {
		return (v1).prod(Math.pow(1 - d.z, 4));
	}

	let h = o.sum(d.prod(ctx.t));
	let l = (new Vector(9 + rnd(), 9 + rnd(), 16)).sum(h.prod(-1)).norm();
	let r = d.sum(ctx.n.prod(ctx.n.sprod(d) * -2));

	let b = l.sprod(ctx.n);
	if (b < 0 || tracer(h, l, ctx)) {
		b = 0;
	}

	if (m & 1) {
		h = h.prod(.2);
		return ((Math.trunc(Math.ceil(h.x) + Math.ceil(h.y)) & 1)
			? v2
			: v3
		).prod(b * .2 + .1);
	}

	let p = (b > 0) ? Math.pow(l.sprod(r), 99) : 0;

	return ((b > 0) ? new Vector(p, p, p) : v4).sum(sampler(h, r).prod(.5));
}


function trace(startX, startY, endX, endY) {
	const startTime = Date.now();
	console.log('%s processId: %s, starting rendering with %o', new Date().toISOString(), process.pid, { startX, startY, endX, endY});
	const v5 = new Vector(13, 13, 13);
	const v6 = new Vector(17, 16, 8);
	let g = (new Vector(-6, -16, 0)).norm();
	let a = (new Vector(0, 0, 1)).vprod(g).norm().prod(.002);
	let b = g.vprod(a).norm().prod(.002);
	let c = a.sum(b).prod(-256).sum(g);

	//let t = a.prod((rnd() - .5) * 99).sum(b.prod((rnd() - .5) * 99));
	const width = endX - startX;
	const height = endY - startY;
	let i = width * height * 4;
	const data = Buffer.alloc(i);

	for (let y = startY; y < endY; y++) {
		for (let x = startX; x < endX; x++) {
			let color = v5;
			for (let samplesCount = 64; samplesCount--;) {
				let t = a.prod((rnd() - 0.5) * 99).sum(b.prod((rnd() - 0.5) * 99));

				color = sampler(v6.sum(t),
					t.prod(-1).sum(a.prod(rnd() + x).sum(b.prod(rnd() + y)).sum(c).prod(16)).norm()
				).prod(3.5).sum(color);
			}
			data[--i] = 0xff;
			data[--i] = color.z;
			data[--i] = color.y;
			data[--i] = color.x;
		}
	}
	console.log('%s processId: %s, finished rendering, duration %s ms', new Date().toISOString(), process.pid, Date.now() - startTime);
	return jpeg.encode({ data, width, height }, 50).data;
}

module.exports = trace;

