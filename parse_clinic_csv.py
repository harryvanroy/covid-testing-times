import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore


def initialise_firebase():
    cred = credentials.Certificate(
        "covid-testing-times-5e9c7-firebase-adminsdk-6tvqn-17c3c38c3f.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db.collection("clinics")


def main():
    url = "https://www.qld.gov.au/__data/assets/file/0020/129602/fever-and-respiratory-clinic-details.csv"
    clinics = pd.read_csv(url).to_dict("records")

    db = initialise_firebase()
    for clinic in clinics[:10]:
        clean_data = {k: clinic[k] for k in clinic if not pd.isna(clinic[k])}
        clean_data["name"] = clean_data.pop("Facility Name ", None)
        clean_data["latitude"] = clean_data.pop("Latitude", None)
        clean_data["longitude"] = clean_data.pop("Longitude", None)
        clean_data["address"] = clean_data.pop("Address", None)
        clean_data["postCode"] = clean_data.pop("Post Code", None)
        clean_data["type"] = clean_data.pop("Clinic type", None)
        clean_data["pathology"] = clean_data.pop("Pathology service", None)
        clean_data["isDriveThrough"] = clean_data.pop("Drive-through", None)
        clean_data.pop("Transport freight and logistics worker testing", None)
        clean_data["isRAT"] = clean_data.pop("RAT", None)
        clean_data["howToFind"] = clean_data.pop("How to find us", None)
        clean_data["phone"] = clean_data.pop("Phone", None)
        clean_data["hours"] = clean_data.pop("Opening Hours", None)
        clean_data["bookingNeeded"] = clean_data.pop("Booking needed", None)
        clean_data["referralNeeded"] = clean_data.pop(
            "GP referral needed", None)
        clean_data["link"] = clean_data.pop("Link", None)
        clean_data.pop("Children tested", None)
        clean_data.pop("Notes", None)
        clean_data = {k: v for k, v in clean_data.items() if v is not None}

        db.add(clean_data)


if __name__ == "__main__":
    main()
