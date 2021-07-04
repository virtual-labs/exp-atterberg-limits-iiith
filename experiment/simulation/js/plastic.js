'use strict';

document.addEventListener('DOMContentLoaded', function() {

	const restartButton = document.getElementById('restart');
	const instrMsg = document.getElementById('procedure-message');

	restartButton.addEventListener('click', function() { restart(); });

	function randomNumber(min, max) {
		return (Math.random() * (max - min + 1) + min).toFixed(2);
	};

	function logic(tableData)
	{
		const soilData = { 'Silt': randomNumber(22.5, 27.5), 'Sand': randomNumber(12, 16), 'Clay': randomNumber(30, 50) };
		tableData.forEach(function(row, index) {
			const ans = (Number)(soilData[row['Soil Type']]);
			row['Water Content(%)'] = ans;
			row['Dry Soil Mass(g)'] = ((100 * wetSoilMass) / (ans + 100)).toFixed(2);
		});
	};

	function limCheck(obj, translate, lim, step)
	{
		if(obj.pos[0] === lim[0])
		{
			translate[0] = 0;
		}

		if(obj.pos[1] === lim[1])
		{
			translate[1] = 0;
		}

		if(translate[0] === 0 && translate[1] === 0)
		{
			if(step === 3)
			{
				objs['soil'].color = "#b86d29";
				keys = keys.filter(function(val, index) {
					return val !== "water";
				});
			}

			else if(step === 4)
			{
				document.getElementById("output2").innerHTML = "Mass of wet soil = " + String(wetSoilMass) + "g";
			}

			else if(step === 7 && !obj.roll(1))
			{
				translate[0] = 5;

				if(lim[0] === 410)
				{
					lim[0] = 600;
				}

				else
				{
					translate[0] = -5;
					lim[0] = 410;
				}

				return step;
			}

			else if(step === enabled.length - 2)
			{
				logic(tableData);
				generateTableHead(table, Object.keys(tableData[0]));
				generateTable(table, tableData);

				document.getElementById("apparatus").style.display = 'none';
				document.getElementById("observations").style.width = '40%';
				if(small)
				{
					document.getElementById("observations").style.width = '85%';
				}
			}

			return step + 1;
		}

		return step;
	};

	function updatePos(obj, translate)
	{
		obj.pos[0] += translate[0];
		obj.pos[1] += translate[1];
	};

	class container {
		constructor(height, width, radius, x, y) {
			this.height = height;
			this.width = width;
			this.radius = radius;
			this.pos = [x, y];
		};

		draw(ctx) {
			ctx.fillStyle = "white";
			ctx.lineWidth = 3;

			if(this.width < 2 * this.radius) 
			{
				this.radius = this.width / 2;
			}

			if(this.height < 2 * this.radius) 
			{
				this.radius = this.height / 2;
			}

			ctx.beginPath();
			ctx.moveTo(this.pos[0] + this.radius, this.pos[1]);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1], this.pos[0] + this.width, this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1] + this.height, this.pos[0], this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0], this.pos[1] + this.height, this.pos[0], this.pos[1], this.radius);
			ctx.arcTo(this.pos[0], this.pos[1], this.pos[0] + this.width, this.pos[1], this.radius);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			const e1 = [this.pos[0] + this.width, this.pos[1]], e2 = [...this.pos];
			const gradX = (e1[0] - e2[0]) / -4, gradY = 10;

			ctx.beginPath();
			ctx.moveTo(e2[0], e2[1]);
			curvedArea(ctx, e2, -1 * gradX, -1 * gradY);
			curvedArea(ctx, e1, gradX, gradY);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};
	};

	class soil {
		constructor(height, width, radius, x, y) {
			this.height = height;
			this.width = width;
			this.radius = radius;
			this.pos = [x, y];
			this.color = "#654321";
		};

		draw(ctx) {
			if(this.width < 2 * this.radius) 
			{
				this.radius = this.width / 2;
			}

			if(this.height < 2 * this.radius) 
			{
				this.radius = this.height / 2;
			}

			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
	
			ctx.moveTo(this.pos[0] + this.radius, this.pos[1]);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1], this.pos[0] + this.width, this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0] + this.width, this.pos[1] + this.height, this.pos[0], this.pos[1] + this.height, this.radius);
			ctx.arcTo(this.pos[0], this.pos[1] + this.height, this.pos[0], this.pos[1], this.radius);
			ctx.arcTo(this.pos[0], this.pos[1], this.pos[0] + this.width, this.pos[1], this.radius);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};
	};

	class soilSpread {
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/soil-spread.png';
			this.img.onload = () => { ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height); };
		};

		draw(ctx) {
			ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);
		};
	};

	class soilBall {
		constructor(radius, x, y) {
			this.radius = radius;
			this.pos = [x, y];
			this.width = 2 * radius;
			this.height = 2 * radius;
		};

		draw(ctx) {
			ctx.fillStyle = "#b86d29";
			ctx.beginPath();
			ctx.arc(this.pos[0] + this.radius, this.pos[1] + this.radius, this.radius, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};

		roll(unit) {
			if(this.radius <= 20)
			{
				return 1;
			}

			this.radius -= unit;
			return 0;
		};
	};

	class brokenSoil {
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = './images/broken-soil.png';
			this.img.onload = () => { ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height); };
		};

		draw(ctx) {
			ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);
		};
	};

	class water {
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
		};

		draw(ctx) {
			ctx.fillStyle = "#1ca3ec";
			ctx.lineWidth = lineWidth;

			ctx.beginPath();
			ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};

		mixing(unit) {
			this.height -= unit;
			this.pos[1] += unit;
		};
	};

	class glassPlate {
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
		};

		draw(ctx)
		{
			const slant = 30, thickness = 15;
			ctx.fillStyle = "#add8ec";

			ctx.beginPath();
			ctx.moveTo(this.pos[0], this.pos[1] + this.height);
			ctx.lineTo(this.pos[0] + slant , this.pos[1]);
			ctx.lineTo(this.pos[0] + this.width - slant, this.pos[1]);
			ctx.lineTo(this.pos[0] + this.width, this.pos[1] + this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.beginPath();
			ctx.rect(this.pos[0], this.pos[1] + this.height, this.width, thickness);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		};
	};

	function init()
	{
		document.getElementById("output1").innerHTML = "Mass of container = ___ g";
		document.getElementById("output2").innerHTML = "Mass of wet soil = ___ g";

		objs = {
			"plate": new glassPlate(150, 390, 360, 215),
			"container": new container(90, 120, 8, 90, 290),
			"water": new water(30, 120, 90, 320),
			"soil": new soil(40, 120, 8, 90, 340),
		};
		keys = [];

		enabled = [["container"], ["container", "soil"], ["container", "soil", "water"], ["container", "soil"], ["container", "soil", "plate"], ["container", "soil", "plate"], ["container", "soil", "plate"], ["container", "soil", "plate"], ["container", "soil", "plate"], []];
		step = 0;
		translate = [0, 0];
		lim = [-1, -1];
		revolts = 0;
		rots = 0;
	};

	function restart() 
	{ 
		window.clearTimeout(tmHandle); 

		document.getElementById("apparatus").style.display = 'block';
		document.getElementById("observations").style.width = '';

		table.innerHTML = "";
		init();

		tmHandle = window.setTimeout(draw, 1000 / fps); 
	};

	function generateTableHead(table, data) {
		const thead = table.createTHead();
		const row = thead.insertRow();
		data.forEach(function(key, ind) {
			const th = document.createElement("th");
			const text = document.createTextNode(key);
			th.appendChild(text);
			row.appendChild(th);
		});
	};

	function generateTable(table, data) {
		data.forEach(function(rowVals, ind) {
			const row = table.insertRow();
			Object.keys(rowVals).forEach(function(key, i) {
				const cell = row.insertCell();
				const text = document.createTextNode(rowVals[key]);
				cell.appendChild(text);
			});
		});
	};

	function check(event, translate, step, flag=true)
	{ 
		if(translate[0] !== 0 || translate[1] !== 0)
		{
			return;
		}

		const canvasPos = [(canvas.width / canvas.offsetWidth) * (event.pageX - canvas.offsetLeft), (canvas.height / canvas.offsetHeight) * (event.pageY - canvas.offsetTop)];
		const errMargin = 10;

		let hover = false;
		canvas.style.cursor = "default";
		keys.forEach(function(val, ind) {
			if(canvasPos[0] >= objs[val].pos[0] - errMargin && canvasPos[0] <= objs[val].pos[0] + objs[val].width + errMargin && canvasPos[1] >= objs[val].pos[1] - errMargin && canvasPos[1] <= objs[val].pos[1] + objs[val].height + errMargin)
			{
				if(step === 3 && val === "soil")
				{
					hover = true;
					translate[1] = 1;
					lim[1] = 350;
				}

				else if(step === 5 && val === "soil")
				{
					hover = true;
					if(flag)
					{
						const center = [objs['soil'].pos[0] + objs['soil'].width / 2, objs['soil'].pos[1] + objs['soil'].height / 2];
						objs['soil'] = new soilSpread(objs['soil'].height * 2, objs['soil'].width * 2, objs['soil'].pos[0], objs['soil'].pos[1]);
					}

					translate[0] = 5;
					translate[1] = -5;
					lim[0] = objs['plate'].pos[0] + objs['plate'].width / 2 - objs['soil'].width / 2;
					lim[1] = objs['plate'].pos[1] + objs['plate'].height/ 2 - objs['soil'].height / 2;
				}

				else if(step === 6 && val === "soil")
				{
					const radius = 50;
					hover = true;
					if(flag)
					{
						objs['soil'] = new soilBall(radius, objs['plate'].pos[0] + objs['plate'].width / 2 - radius, objs['plate'].pos[1] + objs['plate'].height / 2 - radius);
					}
				}

				else if(step === 7 && val === "soil")
				{
					hover = true;
					translate[0] = 5;
					lim[0] = 600;
				}
			}
		});

		if(!flag && hover)
		{
			canvas.style.cursor = "pointer";
			translate[0] = 0;
			translate[1] = 0;
			lim[0] = 0;
			lim[1] = 0;
		}
	};

	function curvedArea(ctx, e, gradX, gradY)
	{
		ctx.bezierCurveTo(e[0], e[1] += gradY, e[0] += gradX, e[1] += gradY, e[0] += gradX, e[1]);
		ctx.bezierCurveTo(e[0] += gradX, e[1], e[0] += gradX, e[1] -= gradY, e[0], e[1] -= gradY);
	};

	const canvas = document.getElementById("main");
	canvas.width = 840;
	canvas.height = 400;
	canvas.style = "border:3px solid";
	const ctx = canvas.getContext("2d");

	const fill = "#A9A9A9", border = "black", lineWidth = 1.5, fps = 150;
	const msgs = [
		"Click on 'Container' in the apparatus menu to add a container to the workspace.",
		"Click on 'Soil Sample' in the apparatus menu to add a soil sample to the container.",
		"Click on 'Water' in the apparatus menu to add water to the soil filled container.",
		"Click on the container to mix the soil with the water.",
		"Click on 'Glass Plate' in the apparatus menu to add a glass plate to the workspace.", 
		"Click on the soil to move it to the glass plate as a soil spread.",
		"Click on the soil to roll it up into a ball.",
		"Click on the soil to roll it into a rod of diameter 3 mm. Finally, determine the water content of the obtained soil pieces. Use the following <a href=''>link</a> to learn more about water content determination.",
		"Click the restart button to perform the experiment again.",
	];

	let step, translate, lim, objs, keys, enabled, small, revolts, rots;
	init();

	const tableData = [
		{ "Soil Type": "Silt", "Dry Soil Mass(g)": "", "Water Content(%)": "" },
		{ "Soil Type": "Sand", "Dry Soil Mass(g)": "", "Water Content(%)": "" },
		{ "Soil Type": "Clay", "Dry Soil Mass(g)": "", "Water Content(%)": "" },
	];

	const objNames = Object.keys(objs);
	objNames.forEach(function(elem, ind) {
		const obj = document.getElementById(elem);
		obj.addEventListener('click', function(event) {
			keys.push(elem);
			step += 1;
		});
	});

	// Input Parameters 
	let wetSoilMass = 100; 
	canvas.addEventListener('mousemove', function(event) {check(event, translate, step, false);});
	canvas.addEventListener('click', function(event) {check(event, translate, step);});

	const table = document.getElementsByClassName("table")[0];

	function responsiveTable(x) {
		if(x.matches)	// If media query matches
		{ 
			small = true;
			if(step === enabled.length - 1)
			{
				document.getElementById("observations").style.width = '85%';
			}
		} 

		else
		{
			small = false;
			if(step === enabled.length - 1)
			{
				document.getElementById("observations").style.width = '40%';
			}
		}
	};

	let x = window.matchMedia("(max-width: 1023px)");
	responsiveTable(x); // Call listener function at run time
	x.addListener(responsiveTable); // Attach listener function on state changes

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height); 
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		let ctr = 0;
		document.getElementById("main").style.pointerEvents = 'none';

		objNames.forEach(function(name, ind) {
			document.getElementById(name).style.pointerEvents = 'auto';
			if(keys.includes(name) || !(enabled[step].includes(name)))
			{
				document.getElementById(name).style.pointerEvents = 'none';
			}

			if(keys.includes(name)) 
			{
				if(enabled[step].includes(name))
				{
					ctr += 1;
				}
				objs[name].draw(ctx);
			}
		});

		if(ctr === enabled[step].length)
		{
			document.getElementById("main").style.pointerEvents = 'auto';
		}

		if(step === 6 && objs['soil'].radius)
		{
			step += 1;
		}

		if(translate[0] !== 0 || translate[1] !== 0)
		{
			let temp = step;
			const soilMoves = [5, 7], waterMoves = [3];

			if(soilMoves.includes(step))
			{
				updatePos(objs['soil'], translate);
				temp = limCheck(objs['soil'], translate, lim, step);
				if(temp != step && step === 7)
				{
					const width = 60, height = 120;
					objs['soil'] = new brokenSoil(height, width, objs['plate'].pos[0] + objs['plate'].width / 2 - width / 2, objs['plate'].pos[1] + objs['plate'].height / 2 - height / 2);
				}
			}

			else if(waterMoves.includes(step))
			{
				objs['water'].mixing(translate[1]);
				temp = limCheck(objs['water'], translate, lim, step);
			}

			step = temp;
		}

		document.getElementById("procedure-message").innerHTML = msgs[step];
		tmHandle = window.setTimeout(draw, 1000 / fps);
	};

	let tmHandle = window.setTimeout(draw, 1000 / fps);
});
