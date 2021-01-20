export interface Logout {
    error: boolean,
    msg: string
}

export interface Login extends Logout {
    loginStatus: boolean
}

interface Course {
    name: string,
    code: string,
    credit?: string,
}

interface SubjectData {
    semCode: string,
    totalCredits: string,
    subjectList: Array<Course>
}

export interface Subjects {
    fetchedAt?: number
    error?: boolean,
    msg?: string,
    currentSem?: string
    currentSemCode?: string
    data?: Array<SubjectData>
}

interface AttendanceData {
    course: Course,
    attendance: {
        total?: string,
        lec?: string,
        tut?: string,
        prac?: string
    },
    details?: {
        date: string,
        teacher: string,
        status: string,
        class: string,
        type: string
    } 
}

export interface Attendance {
    fetchedAt?: number
    error?: boolean,
    msg?: string,
    currentSem?: string
    currentSemCode?: string
    semCode?: string
    data?: Array<AttendanceData> 
}

interface MarksData {
    course: Course,
    marks: {
        t1?: string,
        t2?: string,
        t3?: string,
        labmid?: string,
        labend?: string,
        midva?: string
    }
}

interface SemMarks {
    sem?: string,
    semCode: string,
    marksheet: Array<MarksData> 
}

export interface Marks {
    fetchedAt?: number
    error?: boolean,
    msg?: string,
    data?: Array<SemMarks>
}

interface GradeData {
    course: Course,
    grade: string
}

interface SemGrades {
    sem: string,
    gradesheet: Array<GradeData> 
}

export interface Grades {
    fetchedAt?: number
    error?: boolean,
    msg?: string,
    data?: Array<SemGrades>
}

interface PointsData {
   sem: string,
   credit: string,
   sg: string,
   cg: string
}

export interface Points {
    fetchedAt?: number
    error?: boolean,
    msg?: string,
    data?: Array<PointsData> 
}

interface FeesData {
    sem: string,
    total: string,
    paid: string,
    due: string
 }
 
 export interface Fees {
     fetchedAt?: number
     error?: boolean,
     msg?: string,
     data?: Array<FeesData> 
 }



