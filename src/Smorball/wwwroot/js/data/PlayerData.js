var playerData = {
    baseball: {
        id: "baseball",
        offsetX: 263,
        offsetY: 366,
        sound: {}
    },
    football: {
        id: "football",
        offsetX: 263,
        offsetY: 366,
        sound: {}
    },
    hockey: {
        id: "hockey",
        offsetX: 263,
        offsetY: 366,
        sound: {}
    }
};
//var PlayerData: PlayerData = {
//	man: {
//		"data": {
//			"images": ["man"],
//			"frames": { "regX": 0, "height": 292, "count": 64, "regY": 0, "width": 165 },
//			"animations": { "run": [0, 25, "run", 6], "confused": [26, 63], "stand": [60], "fall": [48, 54, 4] }
//		},
//		"extras": {
//			"sound": { "fall": "hit", "run": "run" },
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	man1: {
//		"data": {
//			"images": ["man1"],
//			"frames": { "regX": 0, "height": 148, "count": 30, "regY": 0, "width": 120 },
//			"animations": { "run": [0, 29, "run", 1.5], "confused": [12, 17], "idle": [3], "tackle": [18, 24, 4] }
//		},
//		"extras": {
//			"sound": { "fall": "hit", "run": "run" },
//			"sX": 2,
//			"sY": 2
//		}
//	},
//	player_helmet: {
//		"data": {
//			"images": ["player_helmet"],
//			"frames": [[1, 1, 104, 200, 0, 0, 43], [107, 1, 109, 200, 0, 5, 43], [218, 1, 120, 211, 0, 16, 54], [340, 1, 130, 226, 0, 26, 69], [472, 1, 142, 241, 0, 37, 84], [616, 1, 152, 257, 0, 47, 100], [770, 1, 151, 257, 0, 47, 100], [923, 1, 151, 257, 0, 47, 100], [1076, 1, 151, 257, 0, 47, 100], [1229, 1, 151, 257, 0, 47, 100], [1382, 1, 151, 257, 0, 47, 100], [1535, 1, 151, 257, 0, 47, 100], [1688, 1, 151, 257, 0, 47, 100], [1841, 1, 151, 257, 0, 47, 100], [1, 260, 151, 257, 0, 47, 100], [154, 260, 151, 257, 0, 47, 100], [307, 260, 151, 257, 0, 47, 100], [460, 260, 151, 257, 0, 47, 100], [613, 260, 151, 257, 0, 47, 100], [766, 260, 151, 257, 0, 47, 100], [919, 260, 151, 257, 0, 47, 100], [1072, 260, 151, 257, 0, 47, 100], [1225, 260, 151, 257, 0, 47, 100], [1378, 260, 151, 257, 0, 47, 100], [1531, 260, 151, 257, 0, 47, 100], [1684, 260, 152, 257, 0, 47, 100], [1838, 260, 154, 257, 0, 47, 100], [1, 519, 151, 257, 0, 47, 100], [154, 519, 151, 257, 0, 47, 100], [307, 519, 104, 200, 0, 0, 43], [413, 519, 104, 200, 0, 0, 43], [519, 519, 104, 200, 0, 0, 43], [625, 519, 104, 200, 0, 0, 43], [731, 519, 104, 200, 0, 0, 43], [837, 519, 104, 200, 0, 0, 43], [943, 519, 104, 199, 0, 0, 42], [1049, 519, 104, 199, 0, 0, 42], [1155, 519, 104, 198, 0, 0, 41], [1261, 519, 104, 197, 0, 0, 40], [1367, 519, 104, 196, 0, 0, 39], [1473, 519, 104, 196, 0, 0, 39], [1579, 519, 104, 196, 0, 0, 39], [1685, 519, 104, 197, 0, 0, 40], [1791, 519, 104, 198, 0, 0, 41], [1897, 519, 104, 199, 0, 0, 42], [1, 778, 104, 199, 0, 0, 42], [107, 778, 104, 200, 0, 0, 43], [213, 778, 104, 200, 0, 0, 43], [319, 778, 134, 170, 0, 30, 13], [455, 778, 134, 169, 0, 30, 12], [591, 778, 134, 167, 0, 30, 10], [727, 778, 134, 166, 0, 30, 9], [863, 778, 134, 167, 0, 30, 10], [999, 778, 134, 169, 0, 30, 12], [1135, 778, 134, 170, 0, 30, 13], [1271, 778, 134, 169, 0, 30, 12], [1407, 778, 134, 167, 0, 30, 10], [1543, 778, 134, 166, 0, 30, 9], [1679, 778, 134, 167, 0, 30, 10], [1815, 778, 134, 169, 0, 30, 12], [1, 980, 104, 199, 0, 0, 42], [107, 980, 104, 198, 0, 0, 41], [213, 980, 108, 195, 0, 0, 38], [323, 980, 123, 189, 0, 0, 32], [448, 980, 104, 197, 0, 0, 40], [554, 980, 212, 159, 0, 108, 2], [768, 980, 212, 158, 0, 108, 1], [982, 980, 221, 158, 0, 0, 1], [1205, 980, 221, 157, 0, 0, 0], [1428, 980, 107, 191, 0, 3, 34], [1537, 980, 107, 191, 0, 3, 34], [1646, 980, 107, 191, 0, 3, 34], [1646, 980, 107, 191, 0, 3, 34], [1646, 980, 107, 191, 0, 3, 34], [1646, 980, 107, 191, 0, 3, 34], [1755, 980, 221, 157, 0, 0, 0], [1, 1181, 221, 158, 0, 0, 1], [224, 1181, 153, 206, 0, 49, 49], [379, 1181, 153, 206, 0, 49, 49], [379, 1181, 153, 206, 0, 49, 49]],
//			"animations": {
//				"confused": [
//					0,
//					31,
//					"idle"
//				],
//				"idle": [
//					32,
//					47
//				],
//				"run": [
//					48,
//					59,
//					"run"
//				],
//				"tackle": [
//					60,
//					79
//				]
//			}
//		},
//		"extras": {
//			"sound": { "tackle": "batHit" },
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	player_cleats: {
//		"data": {
//			"images": ["player_cleats"],
//			"frames": [[1, 1, 104, 200, 0, 0, 38], [107, 1, 109, 200, 0, 5, 38], [218, 1, 120, 211, 0, 16, 49], [340, 1, 130, 226, 0, 26, 64], [472, 1, 142, 241, 0, 37, 79], [616, 1, 152, 257, 0, 47, 95], [770, 1, 151, 257, 0, 47, 95], [923, 1, 151, 257, 0, 47, 95], [1076, 1, 151, 257, 0, 47, 95], [1229, 1, 151, 257, 0, 47, 95], [1382, 1, 151, 257, 0, 47, 95], [1535, 1, 151, 257, 0, 47, 95], [1688, 1, 151, 257, 0, 47, 95], [1841, 1, 151, 257, 0, 47, 95], [1, 260, 151, 257, 0, 47, 95], [154, 260, 151, 257, 0, 47, 95], [307, 260, 151, 257, 0, 47, 95], [460, 260, 151, 257, 0, 47, 95], [613, 260, 151, 257, 0, 47, 95], [766, 260, 151, 257, 0, 47, 95], [919, 260, 151, 257, 0, 47, 95], [1072, 260, 151, 257, 0, 47, 95], [1225, 260, 151, 257, 0, 47, 95], [1378, 260, 151, 257, 0, 47, 95], [1531, 260, 151, 257, 0, 47, 95], [1684, 260, 152, 257, 0, 47, 95], [1838, 260, 154, 257, 0, 47, 95], [1, 519, 151, 257, 0, 47, 95], [154, 519, 151, 257, 0, 47, 95], [307, 519, 104, 200, 0, 0, 38], [413, 519, 104, 200, 0, 0, 38], [519, 519, 104, 200, 0, 0, 38], [625, 519, 104, 200, 0, 0, 38], [731, 519, 104, 200, 0, 0, 38], [837, 519, 104, 200, 0, 0, 38], [943, 519, 104, 199, 0, 0, 37], [1049, 519, 104, 199, 0, 0, 37], [1155, 519, 104, 198, 0, 0, 36], [1261, 519, 104, 197, 0, 0, 35], [1367, 519, 104, 196, 0, 0, 34], [1473, 519, 104, 196, 0, 0, 34], [1579, 519, 104, 196, 0, 0, 34], [1685, 519, 104, 197, 0, 0, 35], [1791, 519, 104, 198, 0, 0, 36], [1897, 519, 104, 199, 0, 0, 37], [1, 778, 104, 199, 0, 0, 37], [107, 778, 104, 200, 0, 0, 38], [213, 778, 104, 200, 0, 0, 38], [319, 778, 134, 170, 0, 30, 8], [455, 778, 134, 169, 0, 30, 7], [591, 778, 134, 167, 0, 30, 5], [727, 778, 134, 166, 0, 30, 4], [863, 778, 134, 167, 0, 30, 5], [999, 778, 134, 169, 0, 30, 7], [1135, 778, 134, 170, 0, 30, 8], [1271, 778, 134, 169, 0, 30, 7], [1407, 778, 134, 167, 0, 30, 5], [1543, 778, 134, 166, 0, 30, 4], [1679, 778, 134, 167, 0, 30, 5], [1815, 778, 134, 169, 0, 30, 7], [1, 980, 104, 199, 0, 0, 37], [107, 980, 104, 198, 0, 0, 36], [213, 980, 108, 195, 0, 0, 33], [323, 980, 123, 189, 0, 0, 27], [448, 980, 104, 197, 0, 0, 35], [554, 980, 212, 166, 0, 108, 4], [768, 980, 212, 165, 0, 108, 3], [982, 980, 221, 164, 0, 0, 2], [1205, 980, 221, 162, 0, 0, 0], [1428, 980, 107, 191, 0, 3, 29], [1537, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1755, 980, 221, 162, 0, 0, 0], [1, 1181, 221, 163, 0, 0, 1], [224, 1181, 153, 206, 0, 49, 44], [379, 1181, 153, 206, 0, 49, 44], [379, 1181, 153, 206, 0, 49, 44]],
//			"animations": {
//				"confused": [0, 31, "idle"],
//				"idle": [
//					32,
//					47
//				],
//				"run": [48, 59, "run"],
//				"tackle": [60, 79]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	player_normal: {
//		"data": {
//			"images": ["baseball"],
//			"frames": [[1, 1, 104, 200, 0, 0, 38], [107, 1, 109, 200, 0, 5, 38], [218, 1, 120, 211, 0, 16, 49], [340, 1, 130, 226, 0, 26, 64], [472, 1, 142, 241, 0, 37, 79], [616, 1, 152, 257, 0, 47, 95], [770, 1, 151, 257, 0, 47, 95], [923, 1, 151, 257, 0, 47, 95], [1076, 1, 151, 257, 0, 47, 95], [1229, 1, 151, 257, 0, 47, 95], [1382, 1, 151, 257, 0, 47, 95], [1535, 1, 151, 257, 0, 47, 95], [1688, 1, 151, 257, 0, 47, 95], [1841, 1, 151, 257, 0, 47, 95], [1, 260, 151, 257, 0, 47, 95], [154, 260, 151, 257, 0, 47, 95], [307, 260, 151, 257, 0, 47, 95], [460, 260, 151, 257, 0, 47, 95], [613, 260, 151, 257, 0, 47, 95], [766, 260, 151, 257, 0, 47, 95], [919, 260, 151, 257, 0, 47, 95], [1072, 260, 151, 257, 0, 47, 95], [1225, 260, 151, 257, 0, 47, 95], [1378, 260, 151, 257, 0, 47, 95], [1531, 260, 151, 257, 0, 47, 95], [1684, 260, 152, 257, 0, 47, 95], [1838, 260, 154, 257, 0, 47, 95], [1, 519, 151, 257, 0, 47, 95], [154, 519, 151, 257, 0, 47, 95], [307, 519, 104, 200, 0, 0, 38], [413, 519, 104, 200, 0, 0, 38], [519, 519, 104, 200, 0, 0, 38], [625, 519, 104, 200, 0, 0, 38], [731, 519, 104, 200, 0, 0, 38], [837, 519, 104, 200, 0, 0, 38], [943, 519, 104, 199, 0, 0, 37], [1049, 519, 104, 199, 0, 0, 37], [1155, 519, 104, 198, 0, 0, 36], [1261, 519, 104, 197, 0, 0, 35], [1367, 519, 104, 196, 0, 0, 34], [1473, 519, 104, 196, 0, 0, 34], [1579, 519, 104, 196, 0, 0, 34], [1685, 519, 104, 197, 0, 0, 35], [1791, 519, 104, 198, 0, 0, 36], [1897, 519, 104, 199, 0, 0, 37], [1, 778, 104, 199, 0, 0, 37], [107, 778, 104, 200, 0, 0, 38], [213, 778, 104, 200, 0, 0, 38], [319, 778, 134, 170, 0, 30, 8], [455, 778, 134, 169, 0, 30, 7], [591, 778, 134, 167, 0, 30, 5], [727, 778, 134, 166, 0, 30, 4], [863, 778, 134, 167, 0, 30, 5], [999, 778, 134, 169, 0, 30, 7], [1135, 778, 134, 170, 0, 30, 8], [1271, 778, 134, 169, 0, 30, 7], [1407, 778, 134, 167, 0, 30, 5], [1543, 778, 134, 166, 0, 30, 4], [1679, 778, 134, 167, 0, 30, 5], [1815, 778, 134, 169, 0, 30, 7], [1, 980, 104, 199, 0, 0, 37], [107, 980, 104, 198, 0, 0, 36], [213, 980, 108, 195, 0, 0, 33], [323, 980, 123, 189, 0, 0, 27], [448, 980, 104, 197, 0, 0, 35], [554, 980, 212, 166, 0, 108, 4], [768, 980, 212, 165, 0, 108, 3], [982, 980, 221, 164, 0, 0, 2], [1205, 980, 221, 162, 0, 0, 0], [1428, 980, 107, 191, 0, 3, 29], [1537, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1646, 980, 107, 191, 0, 3, 29], [1755, 980, 221, 162, 0, 0, 0], [1, 1181, 221, 163, 0, 0, 1], [224, 1181, 153, 206, 0, 49, 44], [379, 1181, 153, 206, 0, 49, 44], [379, 1181, 153, 206, 0, 49, 44]],
//			"animations": {
//				"run": [48, 59, "run", 0.4],
//				"idle": [32, 47, "idle", 1.4],
//				"confused": [0, 31, "idle"],
//				"tackle": [60, 79]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	football_normal: {
//		"data": {
//			"images": ["football_normal"],
//			"frames": [[1, 1, 181, 214, 0, 18, 9], [184, 1, 206, 219, 0, 18, 14], [392, 1, 240, 234, 0, 18, 29], [634, 1, 244, 250, 0, 18, 45], [880, 1, 250, 265, 0, 19, 60], [1132, 1, 265, 280, 0, 30, 75], [1399, 1, 222, 280, 0, 30, 75], [1623, 1, 223, 280, 0, 30, 75], [1, 283, 222, 280, 0, 30, 75], [225, 283, 222, 280, 0, 30, 75], [449, 283, 222, 280, 0, 30, 75], [673, 283, 222, 280, 0, 30, 75], [897, 283, 222, 280, 0, 30, 75], [1121, 283, 222, 280, 0, 30, 75], [1345, 283, 223, 280, 0, 30, 75], [1570, 283, 222, 280, 0, 30, 75], [1794, 283, 222, 280, 0, 30, 75], [1, 565, 222, 280, 0, 30, 75], [225, 565, 222, 280, 0, 30, 75], [449, 565, 222, 280, 0, 30, 75], [673, 565, 222, 280, 0, 30, 75], [897, 565, 222, 280, 0, 30, 75], [1121, 565, 223, 280, 0, 30, 75], [1346, 565, 222, 280, 0, 30, 75], [1570, 565, 222, 280, 0, 30, 75], [1794, 565, 222, 280, 0, 30, 75], [1, 847, 222, 280, 0, 30, 75], [225, 847, 220, 280, 0, 30, 75], [447, 847, 223, 280, 0, 30, 75], [672, 847, 231, 213, 0, 18, 8], [905, 847, 247, 214, 0, 18, 9], [1154, 847, 242, 214, 0, 18, 9], [1398, 847, 181, 214, 0, 18, 9], [1581, 847, 181, 214, 0, 18, 9], [1764, 847, 181, 214, 0, 18, 9], [1, 1129, 181, 213, 0, 18, 8], [184, 1129, 181, 212, 0, 18, 7], [367, 1129, 181, 211, 0, 18, 6], [550, 1129, 181, 210, 0, 18, 5], [733, 1129, 181, 209, 0, 18, 4], [916, 1129, 181, 209, 0, 18, 4], [1099, 1129, 181, 210, 0, 18, 5], [1282, 1129, 181, 211, 0, 18, 6], [1465, 1129, 181, 211, 0, 18, 6], [1648, 1129, 181, 212, 0, 18, 7], [1831, 1129, 181, 213, 0, 18, 8], [1, 1344, 181, 214, 0, 18, 9], [184, 1344, 181, 214, 0, 18, 9], [367, 1344, 265, 229, 0, 38, 24], [634, 1344, 246, 225, 0, 30, 20], [882, 1344, 213, 218, 0, 22, 13], [1097, 1344, 189, 214, 0, 13, 9], [1288, 1344, 167, 217, 0, 3, 12], [1457, 1344, 158, 224, 0, 0, 19], [1617, 1344, 166, 227, 0, 3, 22], [1785, 1344, 161, 224, 0, 3, 19], [1, 1575, 167, 217, 0, 3, 12], [170, 1575, 189, 214, 0, 13, 9], [361, 1575, 213, 218, 0, 22, 13], [576, 1575, 246, 225, 0, 30, 20], [824, 1575, 242, 205, 0, 48, 0], [824, 1575, 242, 205, 0, 48, 0], [1068, 1575, 242, 205, 0, 48, 0], [1312, 1575, 232, 213, 0, 0, 8], [1546, 1575, 232, 213, 0, 0, 8], [1780, 1575, 232, 213, 0, 0, 8], [1, 1802, 232, 213, 0, 0, 8], [235, 1802, 231, 212, 0, 0, 7], [468, 1802, 233, 211, 0, 19, 6], [703, 1802, 239, 208, 0, 35, 3]],
//			"animations": {
//				"confused": [
//					0,
//					31,
//					"idle"
//				],
//				"idle": [
//					32,
//					47,
//					"idle",
//					0.7
//				],
//				"run": [
//					48,
//					59,
//					"run"
//				],
//				"tackle": [
//					60,
//					69
//				]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	football_cleats: {
//		"data": {
//			"images": ["football_cleats"],
//			"frames": [[1, 1, 181, 214, 0, 18, 9], [184, 1, 206, 219, 0, 18, 14], [392, 1, 240, 234, 0, 18, 29], [634, 1, 244, 250, 0, 18, 45], [880, 1, 250, 265, 0, 19, 60], [1132, 1, 265, 280, 0, 30, 75], [1399, 1, 222, 280, 0, 30, 75], [1623, 1, 223, 280, 0, 30, 75], [1, 283, 222, 280, 0, 30, 75], [225, 283, 222, 280, 0, 30, 75], [449, 283, 222, 280, 0, 30, 75], [673, 283, 222, 280, 0, 30, 75], [897, 283, 222, 280, 0, 30, 75], [1121, 283, 222, 280, 0, 30, 75], [1345, 283, 223, 280, 0, 30, 75], [1570, 283, 222, 280, 0, 30, 75], [1794, 283, 222, 280, 0, 30, 75], [1, 565, 222, 280, 0, 30, 75], [225, 565, 222, 280, 0, 30, 75], [449, 565, 222, 280, 0, 30, 75], [673, 565, 222, 280, 0, 30, 75], [897, 565, 222, 280, 0, 30, 75], [1121, 565, 223, 280, 0, 30, 75], [1346, 565, 222, 280, 0, 30, 75], [1570, 565, 222, 280, 0, 30, 75], [1794, 565, 222, 280, 0, 30, 75], [1, 847, 222, 280, 0, 30, 75], [225, 847, 220, 280, 0, 30, 75], [447, 847, 223, 280, 0, 30, 75], [672, 847, 231, 213, 0, 18, 8], [905, 847, 247, 214, 0, 18, 9], [1154, 847, 242, 214, 0, 18, 9], [1398, 847, 181, 214, 0, 18, 9], [1581, 847, 181, 214, 0, 18, 9], [1764, 847, 181, 214, 0, 18, 9], [1, 1129, 181, 213, 0, 18, 8], [184, 1129, 181, 212, 0, 18, 7], [367, 1129, 181, 211, 0, 18, 6], [550, 1129, 181, 210, 0, 18, 5], [733, 1129, 181, 209, 0, 18, 4], [916, 1129, 181, 209, 0, 18, 4], [1099, 1129, 181, 210, 0, 18, 5], [1282, 1129, 181, 211, 0, 18, 6], [1465, 1129, 181, 211, 0, 18, 6], [1648, 1129, 181, 212, 0, 18, 7], [1831, 1129, 181, 213, 0, 18, 8], [1, 1344, 181, 214, 0, 18, 9], [184, 1344, 181, 214, 0, 18, 9], [367, 1344, 265, 229, 0, 38, 24], [634, 1344, 246, 225, 0, 30, 20], [882, 1344, 213, 218, 0, 22, 13], [1097, 1344, 189, 214, 0, 13, 9], [1288, 1344, 167, 217, 0, 3, 12], [1457, 1344, 158, 224, 0, 0, 19], [1617, 1344, 168, 227, 0, 5, 22], [1787, 1344, 163, 224, 0, 5, 19], [1, 1575, 169, 217, 0, 5, 12], [172, 1575, 189, 214, 0, 13, 9], [363, 1575, 213, 218, 0, 22, 13], [578, 1575, 246, 225, 0, 30, 20], [826, 1575, 242, 205, 0, 48, 0], [826, 1575, 242, 205, 0, 48, 0], [1070, 1575, 242, 205, 0, 48, 0], [1314, 1575, 232, 213, 0, 0, 8], [1548, 1575, 232, 213, 0, 0, 8], [1782, 1575, 232, 213, 0, 0, 8], [1, 1802, 232, 213, 0, 0, 8], [235, 1802, 231, 212, 0, 0, 7], [468, 1802, 233, 211, 0, 19, 6], [703, 1802, 239, 208, 0, 35, 3]],
//			"animations": {
//				"confused": [
//					0,
//					31,
//					"idle"
//				],
//				"idle": [
//					32,
//					47,
//					"idle",
//					0.7
//				],
//				"run": [
//					48,
//					59,
//					"run"
//				],
//				"tackle": [
//					60,
//					69
//				]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	football_helmet: {
//		"data": {
//			"images": ["football_helmet"],
//			"frames": [[1, 1, 181, 209, 0, 18, 5], [184, 1, 206, 219, 0, 18, 15], [392, 1, 240, 234, 0, 18, 30], [634, 1, 244, 250, 0, 18, 46], [880, 1, 250, 265, 0, 19, 61], [1132, 1, 265, 280, 0, 30, 76], [1399, 1, 222, 280, 0, 30, 76], [1623, 1, 223, 280, 0, 30, 76], [1, 283, 222, 280, 0, 30, 76], [225, 283, 222, 280, 0, 30, 76], [449, 283, 222, 280, 0, 30, 76], [673, 283, 222, 280, 0, 30, 76], [897, 283, 222, 280, 0, 30, 76], [1121, 283, 222, 280, 0, 30, 76], [1345, 283, 223, 280, 0, 30, 76], [1570, 283, 222, 280, 0, 30, 76], [1794, 283, 222, 280, 0, 30, 76], [1, 565, 222, 280, 0, 30, 76], [225, 565, 222, 280, 0, 30, 76], [449, 565, 222, 280, 0, 30, 76], [673, 565, 222, 280, 0, 30, 76], [897, 565, 222, 280, 0, 30, 76], [1121, 565, 223, 280, 0, 30, 76], [1346, 565, 222, 280, 0, 30, 76], [1570, 565, 222, 280, 0, 30, 76], [1794, 565, 222, 280, 0, 30, 76], [1, 847, 222, 280, 0, 30, 76], [225, 847, 220, 280, 0, 30, 76], [447, 847, 223, 280, 0, 30, 76], [672, 847, 231, 208, 0, 18, 4], [905, 847, 247, 209, 0, 18, 5], [1154, 847, 242, 209, 0, 18, 5], [1398, 847, 181, 209, 0, 18, 5], [1581, 847, 181, 209, 0, 18, 5], [1764, 847, 181, 209, 0, 18, 5], [1, 1129, 181, 208, 0, 18, 4], [184, 1129, 181, 207, 0, 18, 3], [367, 1129, 181, 206, 0, 18, 2], [550, 1129, 181, 205, 0, 18, 1], [733, 1129, 181, 204, 0, 18, 0], [916, 1129, 181, 204, 0, 18, 0], [1099, 1129, 181, 205, 0, 18, 1], [1282, 1129, 181, 206, 0, 18, 2], [1465, 1129, 181, 207, 0, 18, 3], [1648, 1129, 181, 207, 0, 18, 3], [1831, 1129, 181, 208, 0, 18, 4], [1, 1339, 181, 209, 0, 18, 5], [184, 1339, 181, 209, 0, 18, 5], [367, 1339, 265, 224, 0, 38, 20], [634, 1339, 246, 220, 0, 30, 16], [882, 1339, 213, 213, 0, 22, 9], [1097, 1339, 189, 209, 0, 13, 5], [1288, 1339, 167, 212, 0, 3, 8], [1457, 1339, 158, 219, 0, 0, 15], [1617, 1339, 166, 222, 0, 3, 18], [1785, 1339, 161, 219, 0, 3, 15], [1, 1565, 167, 212, 0, 3, 8], [170, 1565, 189, 209, 0, 13, 5], [361, 1565, 213, 213, 0, 22, 9], [576, 1565, 246, 220, 0, 30, 16], [824, 1565, 242, 205, 0, 48, 1], [824, 1565, 242, 205, 0, 48, 1], [1068, 1565, 242, 205, 0, 48, 1], [1312, 1565, 232, 213, 0, 0, 9], [1546, 1565, 232, 213, 0, 0, 9], [1780, 1565, 232, 213, 0, 0, 9], [1, 1787, 232, 213, 0, 0, 9], [235, 1787, 231, 212, 0, 0, 8], [468, 1787, 233, 211, 0, 19, 7], [703, 1787, 239, 208, 0, 35, 4]],
//			"animations": {
//				"confused": [
//					0,
//					31,
//					"idle"
//				],
//				"idle": [
//					32,
//					47,
//					"idle",
//					0.7
//				],
//				"run": [
//					48,
//					59,
//					"run"
//				],
//				"tackle": [
//					60,
//					69
//				]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	hockey_normal: {
//		"data": {
//			"images": ["hockey_normal"],
//			"frames": [[1, 1, 230, 179, 0, 1, 10], [233, 1, 238, 195, 0, 9, 26], [473, 1, 250, 212, 0, 21, 43], [725, 1, 261, 229, 0, 32, 60], [988, 1, 273, 245, 0, 44, 76], [1263, 1, 284, 262, 0, 55, 93], [1549, 1, 284, 262, 0, 55, 93], [1, 265, 284, 262, 0, 55, 93], [287, 265, 284, 262, 0, 55, 93], [573, 265, 284, 262, 0, 55, 93], [859, 265, 284, 262, 0, 55, 93], [1145, 265, 284, 262, 0, 55, 93], [1431, 265, 284, 262, 0, 55, 93], [1717, 265, 284, 262, 0, 55, 93], [1, 529, 284, 262, 0, 55, 93], [287, 529, 284, 262, 0, 55, 93], [573, 529, 284, 262, 0, 55, 93], [859, 529, 284, 262, 0, 55, 93], [1145, 529, 284, 262, 0, 55, 93], [1431, 529, 284, 262, 0, 55, 93], [1717, 529, 284, 262, 0, 55, 93], [1, 793, 284, 262, 0, 55, 93], [287, 793, 284, 262, 0, 55, 93], [573, 793, 230, 173, 0, 1, 4], [805, 793, 230, 173, 0, 1, 4], [1037, 793, 230, 175, 0, 1, 5], [1269, 793, 230, 175, 0, 1, 5], [1501, 793, 230, 175, 0, 1, 5], [1733, 793, 230, 174, 0, 1, 4], [1, 1057, 230, 174, 0, 1, 4], [233, 1057, 230, 173, 0, 1, 3], [465, 1057, 230, 172, 0, 1, 2], [697, 1057, 230, 171, 0, 1, 1], [929, 1057, 230, 171, 0, 1, 1], [1161, 1057, 230, 170, 0, 1, 0], [1393, 1057, 230, 171, 0, 1, 1], [1625, 1057, 230, 171, 0, 1, 1], [1, 1233, 230, 172, 0, 1, 2], [233, 1233, 230, 173, 0, 1, 3], [465, 1233, 230, 174, 0, 1, 4], [697, 1233, 230, 174, 0, 1, 4], [929, 1233, 230, 175, 0, 1, 5], [1161, 1233, 234, 175, 0, 5, 5], [1397, 1233, 230, 175, 0, 5, 5], [1629, 1233, 226, 176, 0, 5, 4], [1, 1411, 221, 180, 0, 5, 3], [224, 1411, 218, 185, 0, 6, 2], [444, 1411, 214, 188, 0, 7, 1], [660, 1411, 210, 192, 0, 8, 0], [872, 1411, 218, 186, 0, 7, 1], [1092, 1411, 224, 181, 0, 5, 3], [1318, 1411, 229, 174, 0, 3, 4], [1549, 1411, 237, 175, 0, 5, 5], [1788, 1411, 243, 177, 0, 5, 7], [1, 1605, 248, 178, 0, 5, 8], [251, 1605, 252, 179, 0, 5, 9], [505, 1605, 250, 179, 0, 5, 9], [757, 1605, 248, 178, 0, 5, 8], [1007, 1605, 241, 177, 0, 0, 7], [1250, 1605, 238, 176, 0, 0, 6], [1490, 1605, 235, 176, 0, 0, 6], [1727, 1605, 232, 175, 0, 0, 5], [1, 1786, 215, 180, 0, 19, 8], [1, 1786, 215, 180, 0, 19, 8], [1, 1786, 215, 180, 0, 19, 8], [218, 1786, 246, 205, 0, 0, 35], [466, 1786, 246, 205, 0, 0, 35], [714, 1786, 246, 205, 0, 0, 35], [962, 1786, 233, 255, 0, 0, 85], [962, 1786, 233, 255, 0, 0, 85], [962, 1786, 233, 255, 0, 0, 85], [1197, 1786, 249, 182, 0, 0, 12], [1448, 1786, 249, 180, 0, 0, 10], [1699, 1786, 249, 177, 0, 0, 7]],
//			"animations": {
//				"confused": [
//					0,
//					25,
//					"idle"
//				],
//				"idle": [
//					26,
//					41,
//					"idle",
//					1
//				],
//				"run": [
//					42,
//					61,
//					"run"
//				],
//				"tackle": [
//					62,
//					73
//				]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	hockey_cleats: {
//		"data": {
//			"images": ["hockey_cleats"],
//			"frames": [[1, 1, 230, 179, 0, 1, 10], [233, 1, 238, 195, 0, 9, 26], [473, 1, 250, 212, 0, 21, 43], [725, 1, 273, 245, 0, 44, 76], [1000, 1, 284, 262, 0, 55, 93], [1286, 1, 284, 262, 0, 55, 93], [1572, 1, 284, 262, 0, 55, 93], [1, 265, 284, 262, 0, 55, 93], [287, 265, 284, 262, 0, 55, 93], [573, 265, 284, 262, 0, 55, 93], [859, 265, 284, 262, 0, 55, 93], [1145, 265, 284, 262, 0, 55, 93], [1431, 265, 284, 262, 0, 55, 93], [1717, 265, 284, 262, 0, 55, 93], [1, 529, 284, 262, 0, 55, 93], [287, 529, 284, 262, 0, 55, 93], [573, 529, 284, 262, 0, 55, 93], [859, 529, 284, 262, 0, 55, 93], [1145, 529, 284, 262, 0, 55, 93], [1431, 529, 284, 262, 0, 55, 93], [1717, 529, 284, 262, 0, 55, 93], [1, 793, 284, 262, 0, 55, 93], [287, 793, 284, 262, 0, 55, 93], [573, 793, 284, 262, 0, 55, 93], [859, 793, 230, 173, 0, 1, 4], [1091, 793, 230, 175, 0, 1, 5], [1323, 793, 230, 175, 0, 1, 5], [1555, 793, 230, 175, 0, 1, 5], [1787, 793, 230, 174, 0, 1, 4], [1, 1057, 230, 174, 0, 1, 4], [233, 1057, 230, 173, 0, 1, 3], [465, 1057, 230, 172, 0, 1, 2], [697, 1057, 230, 171, 0, 1, 1], [929, 1057, 230, 171, 0, 1, 1], [1161, 1057, 230, 170, 0, 1, 0], [1393, 1057, 230, 171, 0, 1, 1], [1625, 1057, 230, 171, 0, 1, 1], [1, 1233, 230, 172, 0, 1, 2], [233, 1233, 230, 173, 0, 1, 3], [465, 1233, 230, 174, 0, 1, 4], [697, 1233, 230, 174, 0, 1, 4], [929, 1233, 230, 175, 0, 1, 5], [1161, 1233, 234, 175, 0, 5, 5], [1397, 1233, 230, 175, 0, 5, 5], [1629, 1233, 226, 176, 0, 5, 4], [1, 1411, 221, 180, 0, 5, 3], [224, 1411, 218, 185, 0, 6, 2], [444, 1411, 214, 188, 0, 7, 1], [660, 1411, 210, 192, 0, 8, 0], [872, 1411, 218, 186, 0, 7, 1], [1092, 1411, 224, 181, 0, 5, 3], [1318, 1411, 229, 174, 0, 3, 4], [1549, 1411, 237, 175, 0, 5, 5], [1788, 1411, 243, 177, 0, 5, 7], [1, 1605, 248, 178, 0, 5, 8], [251, 1605, 252, 179, 0, 5, 9], [505, 1605, 250, 179, 0, 5, 9], [757, 1605, 248, 178, 0, 5, 8], [1007, 1605, 241, 177, 0, 0, 7], [1250, 1605, 238, 176, 0, 0, 6], [1490, 1605, 235, 176, 0, 0, 6], [1727, 1605, 232, 175, 0, 0, 5], [1, 1786, 215, 180, 0, 19, 8], [1, 1786, 215, 180, 0, 19, 8], [1, 1786, 215, 180, 0, 19, 8], [218, 1786, 246, 205, 0, 0, 35], [466, 1786, 246, 205, 0, 0, 35], [714, 1786, 246, 205, 0, 0, 35], [962, 1786, 233, 255, 0, 0, 85], [962, 1786, 233, 255, 0, 0, 85], [962, 1786, 233, 255, 0, 0, 85], [1197, 1786, 249, 182, 0, 0, 12], [1448, 1786, 249, 180, 0, 0, 10], [1699, 1786, 249, 177, 0, 0, 7]],
//			"animations": {
//				"confused": [
//					0,
//					25,
//					"idle"
//				],
//				"idle": [
//					26,
//					41,
//					"idle",
//					1
//				],
//				"run": [
//					42,
//					61,
//					"run"
//				],
//				"tackle": [
//					62,
//					73
//				]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	},
//	hockey_helmet: {
//		"data": {
//			"images": ["hockey_helmet"],
//			"frames": [[1, 1, 230, 179, 0, 1, 12], [233, 1, 238, 195, 0, 9, 28], [473, 1, 250, 212, 0, 21, 45], [725, 1, 261, 229, 0, 32, 62], [988, 1, 273, 245, 0, 44, 78], [1263, 1, 284, 262, 0, 55, 95], [1549, 1, 284, 262, 0, 55, 95], [1, 265, 284, 262, 0, 55, 95], [287, 265, 284, 262, 0, 55, 95], [573, 265, 284, 262, 0, 55, 95], [859, 265, 284, 262, 0, 55, 95], [1145, 265, 284, 262, 0, 55, 95], [1431, 265, 284, 262, 0, 55, 95], [1717, 265, 284, 262, 0, 55, 95], [1, 529, 284, 262, 0, 55, 95], [287, 529, 284, 262, 0, 55, 95], [573, 529, 284, 262, 0, 55, 95], [859, 529, 284, 262, 0, 55, 95], [1145, 529, 284, 262, 0, 55, 95], [1431, 529, 284, 262, 0, 55, 95], [1717, 529, 284, 262, 0, 55, 95], [1, 793, 284, 262, 0, 55, 95], [287, 793, 284, 262, 0, 55, 95], [573, 793, 230, 171, 0, 1, 4], [805, 793, 230, 171, 0, 1, 4], [1037, 793, 230, 173, 0, 1, 5], [1269, 793, 230, 173, 0, 1, 5], [1501, 793, 230, 173, 0, 1, 5], [1733, 793, 230, 172, 0, 1, 4], [1733, 793, 230, 172, 0, 1, 4], [1, 1057, 230, 172, 0, 1, 4], [1, 1057, 230, 172, 0, 1, 4], [233, 1057, 230, 171, 0, 1, 3], [233, 1057, 230, 171, 0, 1, 3], [465, 1057, 230, 170, 0, 1, 2], [465, 1057, 230, 170, 0, 1, 2], [697, 1057, 230, 169, 0, 1, 1], [697, 1057, 230, 169, 0, 1, 1], [929, 1057, 230, 168, 0, 1, 0], [929, 1057, 230, 168, 0, 1, 0], [1161, 1057, 230, 168, 0, 1, 0], [1393, 1057, 230, 173, 0, 1, 5], [1625, 1057, 234, 173, 0, 5, 5], [1, 1232, 230, 173, 0, 5, 5], [233, 1232, 226, 174, 0, 5, 4], [461, 1232, 221, 178, 0, 5, 3], [684, 1232, 218, 182, 0, 6, 1], [904, 1232, 214, 185, 0, 7, 0], [1120, 1232, 210, 190, 0, 8, 0], [1332, 1232, 218, 184, 0, 7, 1], [1552, 1232, 224, 178, 0, 5, 2], [1778, 1232, 229, 172, 0, 3, 4], [1, 1424, 237, 174, 0, 5, 6], [240, 1424, 243, 175, 0, 5, 7], [485, 1424, 248, 176, 0, 5, 8], [735, 1424, 252, 177, 0, 5, 9], [989, 1424, 250, 176, 0, 5, 8], [1241, 1424, 248, 176, 0, 5, 8], [1491, 1424, 241, 175, 0, 0, 7], [1734, 1424, 238, 174, 0, 0, 6], [1, 1603, 235, 174, 0, 0, 6], [238, 1603, 232, 173, 0, 0, 5], [472, 1603, 215, 180, 0, 19, 10], [472, 1603, 215, 180, 0, 19, 10], [472, 1603, 215, 180, 0, 19, 10], [689, 1603, 246, 205, 0, 0, 37], [937, 1603, 246, 205, 0, 0, 37], [1185, 1603, 246, 205, 0, 0, 37], [1433, 1603, 233, 255, 0, 0, 87], [1433, 1603, 233, 255, 0, 0, 87], [1433, 1603, 233, 255, 0, 0, 87], [1668, 1603, 249, 178, 0, 0, 10], [1, 1860, 249, 177, 0, 0, 9], [252, 1860, 249, 174, 0, 0, 6]],
//			"animations": {
//				"confused": [
//					0,
//					25,
//					"idle"
//				],
//				"idle": [
//					26,
//					41,
//					"idle",
//					1
//				],
//				"run": [
//					42,
//					61,
//					"run"
//				],
//				"tackle": [
//					62,
//					73
//				]
//			}
//		},
//		"extras": {
//			"sound": {},
//			"offsetX": 263,
//			"offsetY": 366,
//		}
//	}
//} 
