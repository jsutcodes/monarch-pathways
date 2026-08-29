from django.db import models
from django.conf import settings

#TODO: create student correctly
#Each student should have one centralized profile that follows them throughout their relationship with CAN.
#Basic Information
#* Student ID — automatically generated
#* First name
#* Last name
#* Preferred name
#* Pronouns
#* Date of birth
#* Age — automatically calculated
#* Grade
#* School
#* Graduation year
#* ZIP code/community
#* Student status:
#    * Active
#    * Inactive
#    * Graduated
 #   * Alumni
  #  * Other
#Contact Information
#* Student phone
#* Student email
#* Preferred communication method
#* Parent/guardian contact information
#* Emergency contact, if needed

class MentorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mentor_profile",
    )
    department = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Mentor: {self.user.get_full_name()}"


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    dob = models.DateField(verbose_name="Date of Birth")
    country_of_origin = models.CharField(max_length=100)

    # Secure field layers for profile tracking
    # TODO: Intern Task - Integrate programmatic encryption-at-rest field decoders
    encrypted_phone = models.TextField()
    encrypted_address = models.TextField()

    hs_status = models.CharField(
        max_length=50, help_text="e.g., Freshman, Senior, Graduated"
    )
    college_status = models.CharField(
        max_length=50, help_text="e.g., Prospective, Applied, Enrolled"
    )
    graduation_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Student: {self.user.get_full_Student Demographics

#The system should allow CAN to collect and report demographic information while allowing students to skip sensitive questions.
#Demographic Fields
#* Gender identity
#* Race
#* Ethnicity
#* Hispanic/Latino/a/x
#* Languages spoken
#* Preferred language for communication
#* Language interpretation/translation needs
#* Disability/accessibility needs
#* First-generation college student status
#* Parent/guardian education level
#* Family/migration background — optional
#* Other demographic fields as needed for specific funders
#Important Requirements
#* Include "Prefer not to answer" where appropriate.
#* Sensitive fields should have restricted permissions.
#* CAN administrators should be able to see the percentage of students with missing/not-reported information.
#* The system should allow demographic categories to be updated without overwriting historical data.

#Educational Profile
#The application should track a student's educational journey over time. The "Student" is the master record, and a "StudentEducationLog" holds the historical details.
#Current Education
#* School
#* Grade
#* Graduation year
#* School type
#* Enrollment status
#* Academic interests
#* Career interests
#Educational History
#Track changes in:
#* School
#* Grade
#* Graduation status
#* Postsecondary enrollment
#* Postsecondary institution
#* Program of study
#* Degree/certificate
#* Graduation/completion
#The system should preserve historical records rather than simply replacing old information.

class MentorStudentAssignment(models.Model):
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name="assignments"
    )
    student = models.ForeignKey(
        StudentProfile, on_delete=models.CASCADE, related_name="assigned_mentors"
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("mentor", "student")

    def __str__(self):
        return f"{self.mentor} -> {self.student}"
