
import React from 'react';
import ReportHeader from './ReportHeader';
import GeneralStats from './GeneralStats';
import DetailedStats from './DetailedStats';
import SubjectStats from './SubjectStats';
import AbsencesList from './AbsencesList';
import ReportFooter from './ReportFooter';

interface ReportContentProps {
  logoUrl: string;
  title: string;
  reportType: 'daily' | 'weekly' | 'monthly';
  filteredAbsences: any[];
  filteredClasses: any[];
  students: any[];
  subjects: any[];
  attendanceRate: number;
  subjectsWithClasses: number;
  totalAttendances: number;
  studentsWithPerfectAttendance: number;
  averageAbsencesPerStudent: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  subjectStats: any[];
  studentAbsenceStats: any[];
}

const ReportContent = ({
  logoUrl,
  title,
  reportType,
  filteredAbsences,
  filteredClasses,
  students,
  subjects,
  attendanceRate,
  studentsWithPerfectAttendance,
  averageAbsencesPerStudent,
  justifiedAbsences,
  unjustifiedAbsences,
  subjectStats
}: ReportContentProps) => {
  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.4',
      width: '750px',
      maxWidth: '750px',
      minWidth: '750px',
      margin: '0 auto',
      padding: '30px',
      boxSizing: 'border-box',
      overflow: 'visible',
      position: 'relative'
    }}>
      <ReportHeader logoUrl={logoUrl} title={title} />
      
      <GeneralStats
        totalStudents={students.length}
        totalClasses={filteredClasses.length}
        totalAbsences={filteredAbsences.length}
        attendanceRate={attendanceRate}
      />

      {(reportType === 'weekly' || reportType === 'monthly') && (
        <DetailedStats
          studentsWithPerfectAttendance={studentsWithPerfectAttendance}
          averageAbsencesPerStudent={averageAbsencesPerStudent}
          justifiedAbsences={justifiedAbsences}
          unjustifiedAbsences={unjustifiedAbsences}
        />
      )}

      {(reportType === 'weekly' || reportType === 'monthly') && (
        <SubjectStats subjectStats={subjectStats} />
      )}

      <AbsencesList absences={filteredAbsences} />

      <ReportFooter />
    </div>
  );
};

export default ReportContent;
