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
			}

			else if(step === 4)
			{
				document.getElementById("output2").innerHTML = "Mass of wet soil = " + String(wetSoilMass) + "g";
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

	class soilPat {
		constructor(angle, radius, x, y) {
			this.angle = angle;
			this.radius = radius;
			this.pos = [x, y];
		};

		draw(ctx) {
			ctx.beginPath();
			ctx.fillStyle = "#b86d29";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.ellipse(this.pos[0], this.pos[1], this.radius[0], this.radius[1], this.angle, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
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
			ctx.lineWidth = 3;

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

	class casagrande {
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
			this.img = new Image();
			this.img.src = '../images/casagrande.png';
			this.img.onload = () => { ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height); }; 
		};

		draw(ctx) {
			ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);
		};
	};

	class oven {
		constructor(height, width, x, y) {
			this.height = height;
			this.width = width;
			this.pos = [x, y];
		};

		draw(ctx) {
			// Outline
			ctx.fillStyle = "white";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.rect(this.pos[0], this.pos[1], this.width, this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Lower division(red part)
			const divide = 0.80;
			ctx.fillStyle = "red";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0], this.pos[1] + divide * this.height, this.width, (1 - divide) * this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Main segment(pink part)
			const gap = 0.05;
			ctx.fillStyle = "pink";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0] + gap * this.width, this.pos[1] + gap * this.height, (1 - 2 * gap) * this.width, (divide - gap) * this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Horizontal rectangle at bottom
			const margin = [0.30, 0.05];
			ctx.fillStyle = "white";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0] + margin[0] * this.width, this.pos[1] + (margin[1] + divide) * this.height, (1 - 2 * margin[0]) * this.width, (1 - divide - 2 * margin[1]) * this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.font = "30px Arial";
			ctx.fillStyle = "black";
			ctx.fillText("Oven", this.pos[0] + margin[0] * this.width + 10, this.pos[1] + (margin[1] + divide) * this.height + 25);

			// Small button at bottom
			const buttonGapX = 0.10;
			ctx.fillStyle = "white";
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.rect(this.pos[0] + buttonGapX * this.width, this.pos[1] + (margin[1] + divide) * this.height, (margin[0] - 2 * buttonGapX) * this.width, (1 - divide - 2 * margin[1]) * this.height);
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
			"container": new container(90, 120, 8, 90, 290),
			"casagrande": new casagrande(180, 210, 540, 200),
			"water": new water(30, 120, 90, 320),
			"soil": new soil(40, 120, 8, 90, 340),
		};
		keys = [];

		enabled = [["container"], ["container", "soil"], ["container", "soil", "water"], ["container", "soil"], ["container", "soil", "casagrande"], ["soil", "casagrande"], ["container", "soil", "oven"], ["weight", "container", "soil"], []];
		step = 0;
		translate = [0, 0];
		lim = [-1, -1];
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
		if(translate[0] != 0 || translate[1] != 0)
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
						const center = [objs['soil'].pos[0] + objs['soil'].width / 2, objs['soil'].pos[1] + objs['soil'].height / 2], radius = [30, 45]; 
						objs['soil'] = new soilPat(75 * Math.PI / 180, radius, center[0], center[1]);
					}

					translate[0] = 5;
					translate[1] = -5;
					lim[0] = 625;
					lim[1] = 275;
				}

				else if(step === 6 && val === "container")
				{
					hover = true;
					translate[0] = 5;
					translate[1] = 5;
					lim[0] = 560;
					lim[1] = 150;
				}

				else if(step === 7 && val === "oven" && canvasPos[0] >= objs[val].pos[0] - errMargin && canvasPos[0] <= objs[val].pos[0] + objs[val].width + errMargin && canvasPos[1] >= objs[val].pos[1] + objs[val].height * 0.8 - errMargin && canvasPos[1] <= objs[val].pos[1] + objs[val].height + errMargin)
				{
					hover = true;
					translate[1] = 1;
					lim[1] = 210;
				}

				else if(step === 8 && val === "container")
				{
					hover = true;
					translate[0] = -5;
					translate[1] = -5;
					lim[0] = 135;
					lim[1] = 110;
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

	const fill = "#A9A9A9", border = "black", lineWidth = 1.5, fps = 50;
	const msgs = [
		"Click on 'Weighing Machine' in the apparatus menu to add a weighing machine to the workspace.", 
		"Click on 'Container' in the apparatus menu to add a container to the workspace.",
		"Click on the container to move it to the weighing machine and weigh it.",
		"Click on 'Soil Sample' in the apparatus menu, set appropriate input values (Soil Mass) and click 'Add' to add a soil sample to the workspace.",
		"Click on the soil sample to add it to the container and weigh it.",
		"Click on 'Oven' in the apparatus menu to add an oven to the workspace.", 
		"Click on the container to move it to the oven.",
		"Click on the oven red portion to start the oven and heat the soil.",
		"Click on the container with dry soil to weigh it.",
		"Click the restart button to perform the experiment again.",
	];

	let step, translate, lim, objs, keys, enabled, small;
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

		if(translate[0] != 0 || translate[1] != 0)
		{
			let temp = step;
			const soilMoves = [5, 6, 7, 8], waterMoves = [3];

			if(soilMoves.includes(step))
			{
				updatePos(objs['soil'], translate);
				temp = limCheck(objs['soil'], translate, lim, step);
			}

			if(waterMoves.includes(step))
			{
				updatePos(objs['water'], translate);
				if(step === 3)
				{
					objs['water'].mixing(translate[1]);
				}

				temp = limCheck(objs['water'], translate, lim, step);
			}

			step = temp;
		}

		document.getElementById("procedure-message").innerHTML = msgs[step];
		tmHandle = window.setTimeout(draw, 1000 / fps);
	};

	let tmHandle = window.setTimeout(draw, 1000 / fps);
});
