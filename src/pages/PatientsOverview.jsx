import { DateTime } from 'luxon';
import React, { useState } from 'react';
import FabFormDialog from '../components/forms/FabFormDialog';
import { CenteredContainer } from '../styles/styles';
import PatientOverview from '../components/patientOverview/PatientOverview';
import apiClient from '../api/apiClient';
import NotesSummary from '../components/patientOverview/NotesSummary';
import AlertsSummary from '../components/patientOverview/AlertsSummary';

const PatientsOverview = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [patients, setPatients] = useState([]);

    const loadPatients = () => {
        setIsLoading(true);

        apiClient
            .get('/data')
                .then((dataSummary) => {
                    const rowsRaw: IPatientDataRaw[] = dataSummary.data.map((data) => ({ ...data, careGroups: [] }));
                    const careGroupPromises = rowsRaw.map((row) =>
                        apiClient.get(`/caregroup/user/${row.userID}`)
                    );
                    const alertPromises = rowsRaw.map((row) => apiClient.get(`/alerts/${row.userID}`));

                    Promise.all(careGroupPromises).then((careGroupRes) => {
                        Promise.all(alertPromises).then((alertRes) => {
                            const rows: IPatientData[] = rowsRaw.map((row, index) => {
                                const alerts: IAlert[] = alertRes[index].data.alerts;
                                const alertsUpdatedOn: string[] = [];

                                for (const alert of alerts) {
                                    if (alert.creationDate !== alert.updatedOn) alertsUpdatedOn.push(alert.updatedOn);
                                }

                                const latestUpdated = alertsUpdatedOn.length ? alertsUpdatedOn.reduce((a, b) => (a > b ? a : b)) : 'n/a';

                                return {
                                    ...row,
                                    careGroups: careGroupRes[index].data.careGroups.map((careGroup) => careGroup.groupName).join(','),
                                    lastReviewed:
                                        latestUpdated === 'n/a'
                                            ? latestUpdated
                                            : DateTime.fromISO(latestUpdated).toLocaleString(DateTime.DATETIME_SHORT),
                                };
                            });
                            setPatients(
                                rows.filter((row, index, self) => index === self.findIndex((found) => found.userID === row.userID))
                            );
                        });
                    });
                })
                .finally(() => setIsLoading(false));
        console.log("Getting patients...");
        setIsLoading(false);
    }

    return (
        <CenteredContainer>
            <PatientOverview isLoading={isLoading} patients={patients} loadPatients={loadPatients} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <NotesSummary/>
                <AlertsSummary/>
            </div>
            <FabFormDialog fabText="Add New Patient" formName="patient" loadData={loadPatients} />
        </CenteredContainer>
    );
};

export default PatientsOverview;