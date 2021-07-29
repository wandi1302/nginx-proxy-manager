import React, { useState, useEffect, useCallback } from "react";

import { CertificatesResponse, requestCertificates } from "api/npm";
import { Table } from "components";
import { SuspenseLoader } from "components";
import { intl } from "locale";
import { useInterval } from "rooks";
import styled from "styled-components";

const Root = styled.div`
	display: flex;
	flex-direction: column;
`;

function CertificateAuthorities() {
	const [data, setData] = useState({} as CertificatesResponse);
	const [offset, setOffset] = useState(0);

	const asyncFetch = useCallback(() => {
		requestCertificates(offset)
			.then(setData)
			.catch((error: any) => {
				console.error("fetch data failed", error);
			});
	}, [offset]);

	useEffect(() => {
		asyncFetch();
	}, [asyncFetch]);

	// 1 Minute
	useInterval(asyncFetch, 1 * 60 * 1000, true);

	const cols = [
		{
			name: "id",
			title: intl.formatMessage({ id: "column.id", defaultMessage: "ID" }),
			formatter: "id",
			className: "w-1",
		},
		{
			name: "name",
			title: intl.formatMessage({ id: "column.name", defaultMessage: "Name" }),
		},
	];

	if (typeof data.total !== "undefined" && data.total) {
		return (
			<Root>
				<div className="card">
					<div className="card-status-top bg-yellow" />
					<div className="card-header">
						<h3 className="card-title">
							{intl.formatMessage({
								id: "certificates.title",
								defaultMessage: "Certificates",
							})}
						</h3>
					</div>
					<Table
						columns={cols}
						data={data.items}
						sortBy={data.sort[0].field}
						pagination={{
							limit: data.limit,
							offset: data.offset,
							total: data.total,
							onSetOffset: (num: number) => {
								if (offset !== num) {
									setOffset(num);
								}
							},
						}}
					/>
				</div>
			</Root>
		);
	}

	if (typeof data.total !== "undefined") {
		return <p>No items!</p>;
	}

	return <SuspenseLoader />;
}

export default CertificateAuthorities;
