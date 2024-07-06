type LocationQuery = {
	id: string;
	name: string;
	cell: {
		id: string;
		name: string;
		sector: {
			id: string;
			name: string;
			district: {
				id: string;
				name: string;
				province: {
					id: string;
					name: string;
				};
			};
		};
	};
};

export function flatten_location(location: LocationQuery) {
	return {
		village: {
			id: location.id,
			name: location.name,
		},
		cell: {
			id: location.cell.id,
			name: location.cell.name,
		},
		sector: {
			id: location.cell.sector.id,
			name: location.cell.sector.name,
		},
		district: {
			id: location.cell.sector.district.id,
			name: location.cell.sector.district.name,
		},
		province: {
			id: location.cell.sector.district.province.id,
			name: location.cell.sector.district.province.name,
		},
	};
}
