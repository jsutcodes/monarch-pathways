# Students App Unit Tests 🧪

This directory contains the **unit tests** specifically for the `students` application logic. 

Our team follows an isolated testing strategy: all tests inside this specific folder must focus purely on individual components (models, forms, and utility functions) without cross-app dependencies or routing infrastructure overhead.

---

## 🎯 What We Test Here

When adding features to the `students` app, write unit tests for:
* **Model Properties & Methods:** Custom properties (e.g., `student.full_name`) and logical methods (e.g., `student.is_eligible_for_sports()`).
* **Field Validation:** Custom model/form validators ensuring data integrity.
* **Form Logic:** Isolated testing of form validation logic using `.is_valid()`.

*⚠️ **Note:** Do NOT put multi-step user workflows, API integration checks, or cross-app database validation here. Those belong in the root `/tests` integration folder.*

---

## 🚀 How to Run These Tests

To maintain a fast feedback loop during local development, you can execute only these app-specific tests:

### 1. Run All Tests for the Students App
```bash
python manage.py test students.tests
```

### 2. Run a Specific Test File
```bash
python manage.py test students.tests.test_models
```

### 3. Run a Single Test Case Class
```bash
python manage.py test students.tests.test_models.StudentModelUnitTest
```

---

## 💡 Best Practices for App Unit Tests
1. **Keep it Fast:** Try to minimize unnecessary database hits if you are testing pure Python methods on a model. If you can test an in-memory object without calling `.save()`, do it!
2. **One Assertion Focus:** Keep test methods focused on verifying a single logical outcome or edge case.
3. **Use Descriptive Names:** Name test functions after the exact business rule they enforce (e.g., `test_negative_age_raises_validation_error`).
