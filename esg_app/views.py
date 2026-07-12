import os
import json
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Import our ML model calculations
from .ml_model import calculate_esg_scores

# File path for JSON persistence
DB_FILE = os.path.join(settings.BASE_DIR, 'app_state_db.json')

DEFAULT_STATE = {
    "carbonTransactions": [
        {"date": "2026-07-02", "department": "Logistics", "category": "Fleet", "desc": "Fleet Diesel refuel: 1200 Liters", "value": 3216},
        {"date": "2026-07-05", "department": "Manufacturing", "category": "Manufacturing", "desc": "Electricity consumption: 8500 kWh", "value": 7225},
        {"date": "2026-07-08", "department": "Sales & Marketing", "category": "Expense", "desc": "Client visit domestic flight: 1500 km", "value": 180},
        {"date": "2026-07-10", "department": "Manufacturing", "category": "Purchase", "desc": "Raw material procurement: 2000 kg", "value": 3700}
    ],
    "employeeParticipation": [
        {"employee": "Priya Sharma", "activity": "Reforestation Drive 2026", "proof": "reforestation_pic.jpg", "status": "Completed", "points": 150, "date": "2026-07-05"},
        {"employee": "Rajiv Nair", "activity": "Electronic Waste Roundup", "proof": "ewaste_receipt.pdf", "status": "Under Review", "points": 100, "date": "2026-07-11"},
        {"employee": "Amit Mehta", "activity": "Reforestation Drive 2026", "proof": "sapling_photo.png", "status": "Completed", "points": 150, "date": "2026-07-06"}
    ],
    "challenges": [
        {"id": "ch1", "title": "Zero Waste Sprint", "category": "Zero Waste Challenge", "desc": "Reduce personal office trash to below 1kg per week.", "xp": 200, "difficulty": "Medium", "evidence": "Trash log photo", "deadline": "2026-07-20", "status": "Active"},
        {"id": "ch2", "title": "Commute Green Challenge", "category": "Carbon Offsetting", "desc": "Use public transport or bicycle for 5 consecutive days.", "xp": 120, "difficulty": "Easy", "evidence": "Bus pass / Strava tracking", "deadline": "2026-07-25", "status": "Active"},
        {"id": "ch3", "title": "Office Energy Saver Drive", "category": "Zero Waste Challenge", "desc": "Ensure all testing monitors in department are off after hours.", "xp": 300, "difficulty": "Hard", "evidence": "Monitor check list", "deadline": "2026-08-05", "status": "Draft"}
    ],
    "challengeParticipation": [
        {"challenge": "Zero Waste Sprint", "employee": "Amit Mehta", "progress": 100, "proof": "weighing_receipt.jpg", "status": "Completed", "xp": 200, "date": "2026-07-09"},
        {"challenge": "Commute Green Challenge", "employee": "Priya Sharma", "progress": 60, "proof": "strava_commute.jpg", "status": "Active", "xp": 120, "date": ""},
        {"challenge": "Zero Waste Sprint", "employee": "Rajiv Nair", "progress": 40, "proof": "", "status": "Active", "xp": 200, "date": ""}
    ],
    "policyAcknowledgements": [
        {"employee": "Amit Mehta", "policy": "POL-01", "date": "2026-06-12", "status": "Completed"},
        {"employee": "Amit Mehta", "policy": "POL-02", "date": "2026-07-01", "status": "Completed"},
        {"employee": "Amit Mehta", "policy": "POL-03", "date": "", "status": "Pending"},
        {"employee": "Priya Sharma", "policy": "POL-01", "date": "2026-06-15", "status": "Completed"},
        {"employee": "Rajiv Nair", "policy": "POL-02", "date": "2026-07-03", "status": "Completed"}
    ],
    "audits": [
        {"id": "aud1", "title": "Q2 Operations Audit", "auditor": "S. Nair", "department": "Manufacturing", "date": "2026-06-12", "findings": "3 minor chemical storage issues.", "status": "Completed"},
        {"id": "aud2", "title": "Logistics Carbon Compliance Audit", "auditor": "R. Iyer", "department": "Logistics", "date": "2026-07-01", "findings": "1 vehicle fuel log mismatch.", "status": "Under Review"}
    ],
    "complianceIssues": [
        {"id": "ci1", "desc": "Missing MSDS safety sheets in Chem lab", "severity": "High", "department": "Manufacturing", "owner": "Priya Sharma", "dueDate": "2026-07-10", "status": "Open", "audit": "Q2 Operations Audit"},
        {"id": "ci2", "desc": "Odometer calibration required on logistics truck 4", "severity": "Medium", "department": "Logistics", "owner": "Rajiv Nair", "dueDate": "2026-07-28", "status": "Resolved", "audit": "Logistics Carbon Compliance Audit"},
        {"id": "ci3", "desc": "Scope 3 supplier certification pending review", "severity": "Low", "department": "Corporate", "owner": "Elena Rostova", "dueDate": "2026-07-05", "status": "Open", "audit": "Manual Log"}
    ],
    "notifications": [
        {"id": "n1", "text": "New Compliance Issue raised in Manufacturing", "type": "compliance", "time": "2 hours ago", "unread": True},
        {"id": "n2", "text": "Amit Mehta unlocked the 'Carbon Saver' Badge", "type": "badge", "time": "5 hours ago", "unread": True},
        {"id": "n3", "text": "Anti-Corruption Policy acknowledgement reminder sent", "type": "policy", "time": "1 day ago", "unread": False}
    ],
    "scores": {
        "departments": {
            "MFG": {"environmental": 82, "social": 75, "governance": 88},
            "LOG": {"environmental": 68, "social": 60, "governance": 72},
            "MKT": {"environmental": 89, "social": 70, "governance": 90},
            "RND": {"environmental": 94, "social": 90, "governance": 95},
            "CORP": {"environmental": 80, "social": 85, "governance": 86}
        }
    }
}

def load_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f:
            json.dump(DEFAULT_STATE, f, indent=2)
        return DEFAULT_STATE
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return DEFAULT_STATE

def save_db(state):
    try:
        with open(DB_FILE, 'w') as f:
            json.dump(state, f, indent=2)
        return True
    except Exception:
        return False

# ================= TEMPLATE ROUTERS =================
def index_view(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

def dashboard_view(request):
    return render(request, 'dashboard.html')

def profile_view(request):
    return render(request, 'profile.html')

def challenges_view(request):
    return render(request, 'challenges.html')

def rewards_view(request):
    return render(request, 'rewards.html')

def settings_view(request):
    return render(request, 'settings.html')


# ================= REST API ENDPOINTS =================
def get_state(request):
    db_state = load_db()
    return JsonResponse(db_state)

@csrf_exempt
def save_state(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=400)
    try:
        body = json.loads(request.body)
        
        # Extrapolate calculations using project1.ipynb ML model
        # Gather inputs: total carbon, csr count, active compliance issues
        carbon_transactions = body.get('carbonTransactions', [])
        total_carbon = sum(float(item.get('value', 0)) for item in carbon_transactions)
        
        csr_participations = body.get('employeeParticipation', [])
        completed_csr = len([item for item in csr_participations if item.get('status') == 'Completed'])
        
        compliance_issues = body.get('complianceIssues', [])
        open_violations = len([item for item in compliance_issues if item.get('status') == 'Open'])
        
        # Run ML model calculation
        new_scores = calculate_esg_scores(total_carbon, completed_csr, open_violations)
        
        # Update the scores per department in the state
        # In a real environment we'd split per department, here we scale relatively for demo convenience
        scores = body.get('scores', {})
        if 'departments' not in scores:
            scores['departments'] = DEFAULT_STATE['scores']['departments']
            
        for dept_code, d_scores in scores['departments'].items():
            # Apply slight model offsets to simulate specific department environmental changes
            offset = -3 if dept_code == "LOG" else (3 if dept_code == "RND" else 0)
            d_scores['environmental'] = max(20, min(100, new_scores['environmental'] + offset))
            d_scores['social'] = max(20, min(100, new_scores['social'] + offset))
            d_scores['governance'] = max(20, min(100, new_scores['governance'] + offset))
            
        body['scores'] = scores
        
        save_db(body)
        return JsonResponse(body)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ================= PDF GENERATOR =================
def generate_pdf_report(request):
    report_type = request.GET.get('type', 'summary')
    state = load_db()
    
    # Setup response headers
    response = HttpResponse(content_type='application/pdf')
    filename = f"ecosphere_{report_type}_report_{datetime.now().strftime('%Y%m%d')}.pdf"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    # Initialize ReportLab document
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors
        
        doc = SimpleDocTemplate(response, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=40, bottomMargin=40)
        story = []
        
        styles = getSampleStyleSheet()
        
        # Custom styles definition
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=24,
            textColor=colors.HexColor('#875A7B'),
            spaceAfter=6
        )
        
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            textColor=colors.HexColor('#00A09D'),
            spaceAfter=15
        )
        
        heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            textColor=colors.HexColor('#343434'),
            spaceBefore=15,
            spaceAfter=8
        )
        
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=colors.HexColor('#4A4A4A'),
            spaceAfter=10
        )
        
        table_hdr_style = ParagraphStyle(
            'TableHdrText',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            textColor=colors.white
        )
        
        table_cell_style = ParagraphStyle(
            'TableCellText',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            textColor=colors.HexColor('#333333')
        )

        # Header Title
        story.append(Paragraph("EcoSphere ESG Platform", title_style))
        story.append(Paragraph(f"SYSTEM GENERATED ESG COMPLIANCE STATEMENT | DOWNLOADED: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", subtitle_style))
        story.append(Spacer(1, 10))
        
        if report_type == 'carbon':
            story.append(Paragraph("Environmental Carbon Ledger Summary", heading_style))
            story.append(Paragraph("This audit report aggregates Scope 1, 2, and 3 carbon footprint logs, fuel refills, raw material procurements, and calculated emissions metrics across active enterprise departments.", body_style))
            story.append(Spacer(1, 10))
            
            # Prepare Carbon Table Data
            headers = [Paragraph("Date", table_hdr_style), Paragraph("Department", table_hdr_style), Paragraph("Category", table_hdr_style), Paragraph("Emissions (kg CO2e)", table_hdr_style)]
            table_data = [headers]
            
            for item in state.get('carbonTransactions', []):
                val = item.get('value', 0)
                try:
                    if isinstance(val, str):
                        val = val.replace(',', '')
                    val_num = float(val)
                    val_str = f"{val_num:,.0f}" if val_num.is_integer() else f"{val_num:,.2f}"
                except (ValueError, TypeError):
                    val_str = str(val)
                table_data.append([
                    Paragraph(item.get('date', ''), table_cell_style),
                    Paragraph(item.get('department', ''), table_cell_style),
                    Paragraph(item.get('category', ''), table_cell_style),
                    Paragraph(val_str, table_cell_style)
                ])
                
            col_widths = [80, 150, 150, 160]
            
        elif report_type == 'social':
            story.append(Paragraph("Social CSR Contribution & Participation Audit", heading_style))
            story.append(Paragraph("This register outlines all employee-submitted corporate social responsibility projects, environmental preservation activities, and points distribution records.", body_style))
            story.append(Spacer(1, 10))
            
            # Prepare CSR Table Data
            headers = [Paragraph("Employee", table_hdr_style), Paragraph("Activity Title", table_hdr_style), Paragraph("Points/XP", table_hdr_style), Paragraph("Status", table_hdr_style)]
            table_data = [headers]
            
            for item in state.get('employeeParticipation', []):
                points = item.get('points', 0)
                try:
                    points_num = int(points)
                    points_str = f"+{points_num}"
                except (ValueError, TypeError):
                    points_str = f"+{points}"
                table_data.append([
                    Paragraph(item.get('employee', ''), table_cell_style),
                    Paragraph(item.get('activity', ''), table_cell_style),
                    Paragraph(points_str, table_cell_style),
                    Paragraph(item.get('status', ''), table_cell_style)
                ])
                
            col_widths = [120, 200, 100, 120]
            
        elif report_type == 'governance':
            story.append(Paragraph("Governance & Compliance Audit Register", heading_style))
            story.append(Paragraph("This document reviews critical active operations audits, policy acknowledgment records, and pending compliance/MSDS safety sheet remediation warnings.", body_style))
            story.append(Spacer(1, 10))
            
            # Prepare Compliance Table Data
            headers = [Paragraph("Issue Description", table_hdr_style), Paragraph("Severity", table_hdr_style), Paragraph("Owner", table_hdr_style), Paragraph("Due Date", table_hdr_style), Paragraph("Status", table_hdr_style)]
            table_data = [headers]
            
            for item in state.get('complianceIssues', []):
                table_data.append([
                    Paragraph(item['desc'], table_cell_style),
                    Paragraph(item['severity'], table_cell_style),
                    Paragraph(item['owner'], table_cell_style),
                    Paragraph(item['dueDate'], table_cell_style),
                    Paragraph(item['status'], table_cell_style)
                ])
                
            col_widths = [200, 70, 100, 100, 70]
            
        else: # Summary Report
            story.append(Paragraph("Executive ESG Summary Statement", heading_style))
            story.append(Paragraph("EcoSphere unified scorecard results representing weighted averages across Environmental, Social, and Governance divisions per corporate department.", body_style))
            story.append(Spacer(1, 10))
            
            # Prepare Scorecard Table Data
            headers = [Paragraph("Department", table_hdr_style), Paragraph("Environmental", table_hdr_style), Paragraph("Social", table_hdr_style), Paragraph("Governance", table_hdr_style)]
            table_data = [headers]
            
            depts_mapping = {
                "MFG": "Manufacturing",
                "LOG": "Logistics",
                "MKT": "Sales & Marketing",
                "RND": "R&D",
                "CORP": "Corporate"
            }
            
            for code, data in state.get('scores', {}).get('departments', {}).items():
                name = depts_mapping.get(code, code)
                table_data.append([
                    Paragraph(name, table_cell_style),
                    Paragraph(f"{data['environmental']}%", table_cell_style),
                    Paragraph(f"{data['social']}%", table_cell_style),
                    Paragraph(f"{data['governance']}%", table_cell_style)
                ])
                
            col_widths = [200, 110, 110, 120]
            
        # Draw Table with corporate branding style
        t = Table(table_data, colWidths=col_widths)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#875A7B')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,0), 6),
            ('TOPPADDING', (0,0), (-1,0), 6),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#fcfcfc'), colors.white]),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e0e0e0')),
            ('LINEBELOW', (0,0), (-1,0), 2, colors.HexColor('#00A09D')),
            ('BOTTOMPADDING', (0,1), (-1,-1), 8),
            ('TOPPADDING', (0,1), (-1,-1), 8),
        ]))
        story.append(t)
        
        # Build Document
        doc.build(story)
        return response
    except Exception as e:
        return HttpResponse(f"Error generating PDF: {str(e)}", status=500)
