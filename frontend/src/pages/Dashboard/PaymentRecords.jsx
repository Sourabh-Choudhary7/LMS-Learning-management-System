import React from 'react';
import Layout from '../../layout/Layout';
import { useLocation } from 'react-router-dom';
import { BiRupee } from 'react-icons/bi';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // For handling tables in jsPDF

const PaymentRecords = () => {
    const payments = useLocation().state;
    
    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Payment Records List', 14, 20);

        // Set up the table
        const tableColumn = [
            'SL No.',
            'Customer Name',
            'Customer Id',
            'Subscription Id',
            'Created',
            'Plan Description',
            'Plan Amount',
            'Plan Duration',
            'Status'
        ];

        const tableRows = [];

        payments.data?.forEach((element, index) => {
            const timestamp = element?.created;
            const created = new Date(timestamp * 1000);

            const paymentDetail = payments.paymentDetails?.find(
                detail => detail.subscription.id === element.id
            );

            const rowData = [
                index + 1,
                paymentDetail?.fullName || 'N/A',
                element?.customer || 'N/A',
                element?.id || 'N/A',
                created.toLocaleString(),
                element?.payment_settings?.payment_method_options?.card?.mandate_options?.description || 'N/A',
                (element?.payment_settings?.payment_method_options?.card?.mandate_options?.amount / 100) || 0,
                `${element?.plan?.interval_count} Year`,
                element?.status || 'N/A'
            ];

            tableRows.push(rowData);
        });

        // Add the table to the PDF
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
        });

        // Save the PDF
        doc.save('payment_records.pdf');
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex flex-col flex-wrap gap-4 text-white">
                <h1 className="text-center text-3xl font-semibold text-yellow-500">
                    Payment Records List
                </h1>
                <button
                    onClick={generatePDF}
                    className="self-end btn btn-primary btn-outline btn-sm">
                    Download as PDF
                </button>
                <div className="mx-[5%] w-[90%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                    <div className="overflow-x-auto w-full">
                        <table className="table w-full">
                            <thead className='text-l font-bold'>
                                <tr>
                                    <th>SL No.</th>
                                    <th>Customer Name</th>
                                    <th>Customer Id</th>
                                    <th>Subscription Id</th>
                                    <th>Created</th>
                                    <th>Plan Description</th>
                                    <th>Plan Amount</th>
                                    <th>Plan Duration</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data?.map((element, index) => {
                                    const timestamp = element?.created;
                                    const created = new Date(timestamp * 1000);
                                    const paymentDetail = payments.paymentDetails?.find(
                                        detail => detail.subscription.id === element.id
                                    );
                                    return (
                                        <tr key={element?._id || index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {
                                                    paymentDetail?.fullName?.split(' ')
                                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                        .join(' ')
                                                }
                                            </td>
                                            <td>{element?.customer}</td>
                                            <td>{element?.id}</td>
                                            <td>{created.toLocaleString()}</td>
                                            <td>{element?.payment_settings?.payment_method_options?.card?.mandate_options?.description}</td>
                                            <td className='flex items-center'>
                                                <BiRupee className='inline' />
                                                {(element?.payment_settings?.payment_method_options?.card?.mandate_options?.amount) / 100}
                                            </td>
                                            <td>{element?.plan?.interval_count} Year</td>
                                            <td>
                                                <span className={`rounded-full text-sm ${(element?.status) === 'active' ? 'px-2 py-1 bg-green-700 text-white text-l' : 'px-2 py-1 text-yellow-500 text-l'}`}>
                                                    {element?.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentRecords;
