# student_manager.py

class Student:
    def __init__(self, student_id, name, age, score):
        self.student_id = student_id
        self.name = name
        self.age = age
        self.score = score

    def display(self):
        print(
            f"ID: {self.student_id} | "
            f"Name: {self.name} | "
            f"Age: {self.age} | "
            f"Score: {self.score}"
        )


class StudentManager:
    def __init__(self):
        self.students = []

    def add_student(self, student):
        self.students.append(student)

    def display_all(self):
        print("\n===== STUDENT LIST =====")
        for student in self.students:
            student.display()

    def find_by_id(self, student_id):
        for student in self.students:
            if student.student_id == student_id:
                return student
        return None

    def remove_student(self, student_id):
        student = self.find_by_id(student_id)
        if student:
            self.students.remove(student)
            return True
        return False

    def sort_by_score(self):
        self.students.sort(
            key=lambda student: student.score,
            reverse=True
        )

    def average_score(self):
        if not self.students:
            return 0

        total = sum(
            student.score
            for student in self.students
        )

        return total / len(self.students)

    def highest_score_student(self):
        if not self.students:
            return None

        return max(
            self.students,
            key=lambda student: student.score
        )


def main():
    manager = StudentManager()

    manager.add_student(
        Student("SV001", "Nguyen Van A", 20, 8.5)
    )

    manager.add_student(
        Student("SV002", "Tran Thi B", 21, 9.2)
    )

    manager.add_student(
        Student("SV003", "Le Van C", 19, 7.8)
    )

    manager.add_student(
        Student("SV004", "Pham Thi D", 22, 8.9)
    )

    manager.display_all()

    print("\n===== SORT BY SCORE =====")
    manager.sort_by_score()
    manager.display_all()

    print("\n===== SEARCH STUDENT =====")
    student = manager.find_by_id("SV002")

    if student:
        student.display()
    else:
        print("Student not found")

    print("\n===== AVERAGE SCORE =====")
    print(
        f"Average Score: "
        f"{manager.average_score():.2f}"
    )

    print("\n===== TOP STUDENT =====")
    top_student = manager.highest_score_student()

    if top_student:
        top_student.display()

    print("\n===== REMOVE STUDENT =====")

    if manager.remove_student("SV003"):
        print("Removed successfully")
    else:
        print("Student not found")

    manager.display_all()


if __name__ == "__main__":
    main()