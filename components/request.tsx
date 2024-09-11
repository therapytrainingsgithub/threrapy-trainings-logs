// import React, { useEffect, useState } from "react";
// import { useClinicalLogsContext } from "@/app/context/clinicalContext";

// import { useFormik } from "formik";
// import * as Yup from "yup";

// interface RequestProps {
//   log: Record<string, React.ReactNode>;
//   closePopup: () => void;
//   refresh: () => void;
// }

// const Request: React.FC<RequestProps> = ({ log, closePopup, refresh }) => {
//   const [clinicalLog, setClinicalLog] = useState<Record<string, any> | null>(
//     null
//   );
//   const { allClinicalLogs, refreshLogs } = useClinicalLogsContext();

//   useEffect(() => {
//     if (log && allClinicalLogs) {
//       const matchedLog = allClinicalLogs.find((l) => l.id === log.Log_Id);
//       setClinicalLog(matchedLog || null);
//     }
//   }, [allClinicalLogs, log]);

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Formik setup with validation schema
//   const formik = useFormik({
//     initialValues: {
//       status: clinicalLog ? clinicalLog.status : "",
//     },
//     enableReinitialize: true, // Reinitialize form when clinicalLog updates
//     validationSchema: Yup.object({
//       status: Yup.string().required("Status is required"),
//     }),
//     onSubmit: 
//   });

//   return (
//     <div className="p-4">
//       <h3 className="text-lg font-bold mb-4">Log Details</h3>
//       <div className="space-y-2">
//         {clinicalLog && (
//           <>
//             <div className="flex justify-between">
//               <span className="font-semibold">Date:</span>
//               <span>{formatDate(clinicalLog.created_at)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-semibold">Week:</span>
//               <span>{clinicalLog.week}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-semibold">Direct Hours:</span>
//               <span>{clinicalLog.direct_Hours}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-semibold">Indirect Hours:</span>
//               <span>{clinicalLog.indirect_Hours}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-semibold">Site:</span>
//               <span>{clinicalLog.site}</span>
//             </div>
//             <form onSubmit={formik.handleSubmit}>
//               <div className="flex justify-between">
//                 <span className="font-semibold">Status:</span>
//                 <select
//                   id="status"
//                   name="status"
//                   value={formik.values.status}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className="p-1 rounded border-2"
//                 >
//                   <option value="" disabled>
//                     Select a status
//                   </option>
//                   <option value="pending">Pending</option>
//                   <option value="approved">Approved</option>
//                   <option value="denied">Denied</option>
//                 </select>
//               </div>
//               {formik.touched.status &&
//               typeof formik.errors.status === "string" ? (
//                 <div className="text-red-500">{formik.errors.status}</div>
//               ) : null}
//               <div className="w-full mt-4">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Request;
