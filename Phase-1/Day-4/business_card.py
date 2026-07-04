# business_card.py

card = {
    "Name": "Achukatla Shaik usman",
    "Role": "AI & Data Science Student", 
    "Email": "usman@example.com",
    "Phone": "+91-9876543210",
    "LinkedIn": "linkedin.com/in/usman"
}
print("===== BUSINESS CARD =====")
for key, value in card.items():
    print(f"{key:<10}: {value}")
# Update Role
card["Role"] = "Python Developer"

print("\nAfter Updating Role\n")

print("===== BUSINESS CARD =====")
for key, value in card.items():
    print(f"{key:<10}: {value}")