# Firestore Security Specification — Jamia Islamia Abbottabad Portal

## 1. Data Invariants
1. **Fatwas (`/fatwas/{fatwaId}`)**: Must have valid string ID, fatwaNumber, and category. Read is public for published rulings; write operations must contain required localized objects and metadata.
2. **Online Questions (`/online_questions/{questionId}`)**: Any visitor can submit a question (Istifta) with valid name, email, subject, and question text. Admin can update status and publish reply.
3. **Class Bookings (`/class_bookings/{bookingId}`)**: Public visitors can submit trial class / admission bookings with valid studentName, phone, and course.
4. **Exam Results (`/exam_results/{resultId}`)**: Public visitors can query and verify examination transcripts by roll number. Writes must include rollNumber, studentName, and marks.
5. **Departments, Faculty, Books, Media, News, Site Settings**: Public read access to institutional information; writes are restricted to structured schema shapes.

## 2. Validation Payloads
- Valid/Invalid payload specifications for Fatwas, Questions, Bookings, Results, News, Settings.
